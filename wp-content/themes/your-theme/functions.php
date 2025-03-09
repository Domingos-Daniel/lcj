<?php
/**
 * Integração OAuth para LCJ Educa
 * Adicione este código ao seu arquivo functions.php
 */

// Prevenção de acesso direto
if (!defined('ABSPATH')) {
    exit;
}

// Função para registrar logs
if (!function_exists('lcj_log')) {
    function lcj_log($message, $data = null) {
        $log_entry = "[LCJ] " . $message;
        if ($data !== null) {
            if (is_array($data) || is_object($data)) {
                $log_entry .= ": " . print_r($data, true);
            } else {
                $log_entry .= ": " . $data;
            }
        }
        error_log($log_entry);
    }
}

// Adicionar suporte a CORS para permitir requisições da aplicação Next.js
function lcj_handle_cors() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept");
    
    // Responder imediatamente a requisições OPTIONS (preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'lcj_handle_cors');

// Registrar endpoints da REST API
add_action('rest_api_init', function() {
    // Endpoint para autenticação OAuth Google
    register_rest_route('lcj/v1', '/oauth/google', [
        'methods'             => 'POST',
        'callback'            => 'lcj_handle_google_oauth',
        'permission_callback' => '__return_true', // Permitir acesso não autenticado
    ]);

    // Endpoint para obter detalhes do usuário
    register_rest_route('lcj/v1', '/user/details', [
        'methods'             => 'GET',
        'callback'            => 'lcj_get_user_details',
        'permission_callback' => function($request) {
            $token = $request->get_param('token');
            if ($token) {
                return lcj_check_auth_token_param($token);
            }
            return lcj_check_auth_token($request);
        },
    ]);

    // Endpoint para atualizar perfil do usuário
    register_rest_route('lcj/v1', '/user/update', [
        'methods'             => 'POST',
        'callback'            => 'lcj_update_user_profile',
        'permission_callback' => function($request) {
            $token = $request->get_param('token');
            if ($token) {
                return lcj_check_auth_token_param($token);
            }
            return lcj_check_auth_token($request);
        },
    ]);

    // Endpoint especial para usuários OAuth (sem verificação de senha)
    register_rest_route('lcj/v1', '/user/update-oauth', [
        'methods'             => 'POST',
        'callback'            => 'lcj_update_oauth_user_profile',
        'permission_callback' => function($request) {
            $token = $request->get_param('token');
            if ($token) {
                return lcj_check_auth_token_param($token);
            }
            return lcj_check_auth_token($request);
        },
    ]);

    // Endpoint para debug de token
    register_rest_route('lcj/v1', '/debug-token', [
        'methods'             => 'GET',
        'callback'            => 'lcj_debug_token',
        'permission_callback' => '__return_true',
    ]);
    
    // Endpoint para listar rotas disponíveis
    register_rest_route('lcj/v1', '/list-routes', [
        'methods'             => 'GET',
        'callback'            => function() {
            global $wp_rest_server;
            $routes = array_keys($wp_rest_server->get_routes());
            $lcj_routes = array_filter($routes, function($route) {
                return strpos($route, '/lcj/') === 0;
            });
            return [
                'all_routes_count' => count($routes),
                'lcj_routes' => $lcj_routes
            ];
        },
        'permission_callback' => '__return_true',
    ]);
});

// Verificar token via parâmetro URL
function lcj_check_auth_token_param($token) {
    lcj_log("Verificando token via parâmetro URL", substr($token, 0, 10) . "...");
    
    if (empty($token)) {
        lcj_log("Token vazio");
        return false;
    }
    
    // Buscar usuário pelo token como valor simples
    global $wpdb;
    
    // Verificar no formato simples
    $user_id = $wpdb->get_var($wpdb->prepare(
        "SELECT user_id FROM {$wpdb->usermeta} 
         WHERE meta_key = 'lcj_auth_token_value' 
         AND meta_value = %s",
        $token
    ));
    
    // Se não encontrar, verificar no formato serializado
    if (!$user_id) {
        lcj_log("Token não encontrado como valor simples, verificando formato serializado");
        
        $users_with_tokens = $wpdb->get_results(
            "SELECT user_id, meta_value FROM {$wpdb->usermeta} 
             WHERE meta_key = 'lcj_auth_token'"
        );
        
        foreach ($users_with_tokens as $user_data) {
            $stored_data = maybe_unserialize($user_data->meta_value);
            
            if (is_array($stored_data) && 
                isset($stored_data['token']) && 
                $stored_data['token'] === $token) {
                
                $user_id = $user_data->user_id;
                
                // Converter para novo formato
                update_user_meta($user_id, 'lcj_auth_token_value', $token);
                update_user_meta($user_id, 'lcj_auth_token_expires', 
                    isset($stored_data['expires']) ? $stored_data['expires'] : time() + (30 * DAY_IN_SECONDS)
                );
                
                lcj_log("Token encontrado no formato serializado", $user_id);
                break;
            }
        }
    }
    
    if (!$user_id) {
        lcj_log("Token não encontrado");
        return false;
    }
    
    // Token encontrado, definir usuário atual
    wp_set_current_user($user_id);
    lcj_log("Token válido, usuário definido", $user_id);
    return true;
}

// Verificar token via header Authorization
function lcj_check_auth_token($request) {
    $headers = $request->get_headers();
    
    if (!isset($headers['authorization']) || empty($headers['authorization'][0])) {
        lcj_log("Nenhum header de autorização encontrado");
        return false;
    }
    
    $auth_header = $headers['authorization'][0];
    if (strpos($auth_header, 'Bearer ') !== 0) {
        lcj_log("Header de autorização não começa com Bearer");
        return false;
    }
    
    $token = substr($auth_header, 7);
    
    // Usar a função de verificação de token por parâmetro
    return lcj_check_auth_token_param($token);
}

// Endpoint para autenticação Google
function lcj_handle_google_oauth($request) {
    lcj_log("Recebida solicitação de OAuth Google");
    
    $params = $request->get_json_params();
    
    // Validar dados
    if (empty($params['email'])) {
        lcj_log("Email não fornecido");
        return new WP_Error(
            'missing_parameter', 
            'Email é obrigatório', 
            ['status' => 400]
        );
    }
    
    $email = sanitize_email($params['email']);
    $name = !empty($params['name']) ? sanitize_text_field($params['name']) : '';
    $picture = !empty($params['picture']) ? esc_url_raw($params['picture']) : '';
    
    // Verificar se usuário existe
    $user = get_user_by('email', $email);
    
    if ($user) {
        // Usuário já existe
        $user_id = $user->ID;
        lcj_log("Usuário existente encontrado", $user_id);
        
        // Atualizar avatar
        if ($picture) {
            update_user_meta($user_id, 'google_profile_picture', $picture);
        }
    } else {
        // Criar novo usuário
        lcj_log("Criando novo usuário", $email);
        
        // Gerar username do email
        $username = sanitize_user(substr($email, 0, strpos($email, '@')));
        $username = preg_replace('/[^a-z0-9_]/i', '', $username);
        
        // Garantir que seja único
        $original_username = $username;
        $count = 1;
        while (username_exists($username)) {
            $username = $original_username . $count;
            $count++;
        }
        
        // Dividir nome
        $name_parts = explode(' ', $name);
        $first_name = !empty($name_parts[0]) ? $name_parts[0] : '';
        $last_name = count($name_parts) > 1 ? end($name_parts) : '';
        
        // Verificar role
        $role = 'subscriber';
        if (get_role('armember')) {
            $role = 'armember';
        }
        
        // Criar usuário
        $user_data = [
            'user_login'    => $username,
            'user_email'    => $email,
            'display_name'  => $name,
            'first_name'    => $first_name,
            'last_name'     => $last_name,
            'user_pass'     => wp_generate_password(16),
            'role'          => $role
        ];
        
        $user_id = wp_insert_user($user_data);
        
        if (is_wp_error($user_id)) {
            lcj_log("Erro ao criar usuário", $user_id->get_error_message());
            return $user_id;
        }
        
        // Salvar avatar
        if ($picture) {
            update_user_meta($user_id, 'google_profile_picture', $picture);
        }
    }
    
    // Definir status OAuth - AGORA DEPOIS DE TER $user_id DEFINIDO
    update_user_meta($user_id, 'oauth_user', true);
    update_user_meta($user_id, 'oauth_provider', 'google');
    lcj_log("Definido status OAuth para usuário", $user_id);
    
    // Gerar token
    $token = bin2hex(random_bytes(32));
    
    // Salvar token em ambos os formatos
    update_user_meta($user_id, 'lcj_auth_token', [
        'token' => $token,
        'created' => time(),
        'expires' => time() + (30 * DAY_IN_SECONDS)
    ]);
    
    update_user_meta($user_id, 'lcj_auth_token_value', $token);
    update_user_meta($user_id, 'lcj_auth_token_expires', time() + (30 * DAY_IN_SECONDS));
    
    lcj_log("Token gerado com sucesso", substr($token, 0, 10) . "...");
    
    return [
        'success' => true,
        'token' => $token,
        'user_id' => $user_id,
        'message' => 'Autenticação bem-sucedida'
    ];
}

// Obter detalhes do usuário
function lcj_get_user_details($request) {
    $current_user = wp_get_current_user();
    
    if (!$current_user || $current_user->ID === 0) {
        lcj_log("Usuário não autenticado");
        return new WP_Error('not_authorized', 'Usuário não autenticado', ['status' => 401]);
    }
    
    lcj_log("Obtendo detalhes para usuário", $current_user->ID);
    
    // Obter avatar
    $avatar_url = get_avatar_url($current_user->ID);
    $google_image = get_user_meta($current_user->ID, 'google_profile_picture', true);
    
    if (!$avatar_url && $google_image) {
        $avatar_url = $google_image;
    }
    
    // Obter campos personalizados
    $phone = get_user_meta($current_user->ID, 'phone', true);
    if (!$phone) {
        // Tentar obter do campo ARMember
        $phone = get_user_meta($current_user->ID, 'text_tn7to', true);
    }
    
    $gender = get_user_meta($current_user->ID, 'gender', true);
    $bio = get_user_meta($current_user->ID, 'description', true);
    if (!$bio) {
        $bio = $current_user->description;
    }
    
    $is_oauth = get_user_meta($current_user->ID, 'oauth_user', true);
    
    $user_data = array(
        'id' => $current_user->ID,
        'username' => $current_user->user_login,
        'email' => $current_user->user_email,
        'display_name' => $current_user->display_name,
        'first_name' => $current_user->first_name,
        'last_name' => $current_user->last_name,
        'description' => $bio,
        'registered' => $current_user->user_registered,
        'avatar' => $avatar_url,
        'phone' => $phone,
        'gender' => $gender,
        'oauth_user' => !empty($is_oauth), // Adiciona a informação se é OAuth
    );
    
    return $user_data;
}

// Atualizar perfil do usuário
function lcj_update_user_profile($request) {
    $current_user = wp_get_current_user();
    
    if (!$current_user || $current_user->ID === 0) {
        return new WP_Error('not_authorized', 'Usuário não autenticado', ['status' => 401]);
    }
    
    $params = $request->get_json_params();
    $user_id = $current_user->ID;
    
    // Preparar dados para atualização
    $userdata = [
        'ID' => $user_id
    ];
    
    // Atualizar dados básicos
    if (isset($params['first_name'])) {
        $userdata['first_name'] = sanitize_text_field($params['first_name']);
    }
    
    if (isset($params['last_name'])) {
        $userdata['last_name'] = sanitize_text_field($params['last_name']);
    }
    
    // Atualizar nome completo
    if (isset($params['first_name']) || isset($params['last_name'])) {
        $first = isset($params['first_name']) ? $params['first_name'] : $current_user->first_name;
        $last = isset($params['last_name']) ? $params['last_name'] : $current_user->last_name;
        $userdata['display_name'] = trim("$first $last");
    }
    
    if (isset($params['email']) && is_email($params['email'])) {
        $userdata['user_email'] = sanitize_email($params['email']);
    }
    
    if (isset($params['bio'])) {
        $userdata['description'] = sanitize_textarea_field($params['bio']);
    }
    
    // Atualizar status OAuth se solicitado
    if (isset($params['update_oauth']) || isset($params['oauth'])) {
        update_user_meta($user_id, 'oauth_user', true);
        lcj_log("Status OAuth atualizado para usuário: " . $user_id);
    }
    
    // Atualizar senha se fornecida
    if (!empty($params['new_password'])) {
        // SOLUÇÃO 1: Verificar email para identificar usuários Gmail
        if (strpos($current_user->user_email, 'gmail.com') !== false || 
            strpos($current_user->user_email, 'googlemail.com') !== false) {
            
            // Marcar como OAuth
            update_user_meta($user_id, 'oauth_user', true);
            lcj_log("Usuário reconhecido como OAuth pelo email Gmail: " . $current_user->user_email);
            
            // Não verificar senha antiga
            $userdata['user_pass'] = $params['new_password'];
        }
        else {
            // SOLUÇÃO 2: Verificar meta 'oauth_user'
            $is_oauth = get_user_meta($user_id, 'oauth_user', true);
            lcj_log("Verificação de senha - Usuário ID: " . $user_id . ", É OAuth? " . ($is_oauth ? "Sim" : "Não"));
            
            if ($is_oauth) {
                // Usuário OAuth - não verificar senha antiga
                $userdata['user_pass'] = $params['new_password'];
                lcj_log("Senha será atualizada sem verificação (OAuth)");
            } 
            else {
                // Usuário normal - verificar senha antiga
                if (empty($params['current_password']) || !wp_check_password($params['current_password'], $current_user->user_pass, $user_id)) {
                    lcj_log("Senha atual inválida para usuário: " . $user_id);
                    return new WP_Error('invalid_password', 'Senha atual inválida', ['status' => 400]);
                }
                $userdata['user_pass'] = $params['new_password'];
                lcj_log("Senha verificada e será atualizada normalmente");
            }
        }
    }
    
    // Atualizar usuário
    $result = wp_update_user($userdata);
    
    if (is_wp_error($result)) {
        lcj_log("Erro ao atualizar usuário: " . $result->get_error_message());
        return $result;
    }
    
    // Atualizar metadados
    if (isset($params['phone'])) {
        $phone = sanitize_text_field($params['phone']);
        // Salvar em ambos os formatos para compatibilidade com ARMember
        update_user_meta($user_id, 'phone', $phone);
        update_user_meta($user_id, 'text_tn7to', $phone);
        lcj_log("Telefone atualizado: " . $phone);
    }
    
    if (isset($params['gender'])) {
        update_user_meta($user_id, 'gender', sanitize_text_field($params['gender']));
    }
    
    return [
        'success' => true,
        'message' => 'Perfil atualizado com sucesso'
    ];
}

// Endpoint específico para atualização de usuários OAuth
function lcj_update_oauth_user_profile($request) {
    $current_user = wp_get_current_user();
    
    if (!$current_user || $current_user->ID === 0) {
        return new WP_Error('not_authorized', 'Usuário não autenticado', ['status' => 401]);
    }
    
    $params = $request->get_json_params();
    $user_id = $current_user->ID;
    
    // Forçar definição da flag OAuth
    update_user_meta($user_id, 'oauth_user', true);
    lcj_log("Usuário ID $user_id marcado como OAuth via endpoint especial");
    
    // Preparar dados para atualização
    $userdata = [
        'ID' => $user_id
    ];
    
    if (isset($params['first_name'])) {
        $userdata['first_name'] = sanitize_text_field($params['first_name']);
    }
    
    if (isset($params['last_name'])) {
        $userdata['last_name'] = sanitize_text_field($params['last_name']);
    }
    
    if (isset($params['first_name']) || isset($params['last_name'])) {
        $first = isset($params['first_name']) ? $params['first_name'] : $current_user->first_name;
        $last = isset($params['last_name']) ? $params['last_name'] : $current_user->last_name;
        $userdata['display_name'] = trim("$first $last");
    }
    
    if (isset($params['email']) && is_email($params['email'])) {
        $userdata['user_email'] = sanitize_email($params['email']);
    }
    
    if (isset($params['bio'])) {
        $userdata['description'] = sanitize_textarea_field($params['bio']);
    }
    
    // Atualizar senha sem verificação
    if (!empty($params['new_password'])) {
        $userdata['user_pass'] = $params['new_password'];
        lcj_log("Senha será atualizada via endpoint OAuth");
    }
    
    // Atualizar usuário
    $result = wp_update_user($userdata);
    
    if (is_wp_error($result)) {
        lcj_log("Erro ao atualizar usuário via endpoint OAuth: " . $result->get_error_message());
        return $result;
    }
    
    // Atualizar metadados
    if (isset($params['phone'])) {
        $phone = sanitize_text_field($params['phone']);
        update_user_meta($user_id, 'phone', $phone);
        update_user_meta($user_id, 'text_tn7to', $phone);
        lcj_log("Telefone atualizado: " . $phone);
    }
    
    if (isset($params['gender'])) {
        update_user_meta($user_id, 'gender', sanitize_text_field($params['gender']));
    }
    
    return [
        'success' => true,
        'message' => 'Perfil atualizado com sucesso via OAuth'
    ];
}

// Endpoint de debug para token
function lcj_debug_token($request) {
    $headers = $request->get_headers();
    $auth_header = isset($headers['authorization']) ? $headers['authorization'][0] : 'Nenhum header de autorização';
    $token_param = $request->get_param('token') ? $request->get_param('token') : 'Nenhum token via parâmetro';
    
    $server_headers = [];
    foreach($_SERVER as $key => $value) {
        if(substr($key, 0, 5) === 'HTTP_') {
            $server_headers[$key] = $value;
        }
    }
    
    $result = [
        'headers_received' => $headers,
        'auth_header' => $auth_header,
        'token_param' => $token_param,
        'server_headers' => $server_headers,
    ];
    
    // Se temos token via parâmetro ou header, verificar validade
    $token = '';
    if (strpos($auth_header, 'Bearer ') === 0) {
        $token = substr($auth_header, 7);
        $result['token_in_header'] = substr($token, 0, 10) . '...';
    } elseif ($token_param !== 'Nenhum token via parâmetro') {
        $token = $token_param;
        $result['token_in_param'] = substr($token, 0, 10) . '...';
    }
    
    if (!empty($token)) {
        // Verificar token no banco
        global $wpdb;
        
        // Verificar como valor simples
        $user_id_simple = $wpdb->get_var($wpdb->prepare(
            "SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = 'lcj_auth_token_value' AND meta_value = %s",
            $token
        ));
        
        $result['found_simple'] = !empty($user_id_simple);
        $result['user_id_simple'] = $user_id_simple;
        
        // Verificar formato serializado
        $users_with_tokens = $wpdb->get_results(
            "SELECT user_id, meta_value FROM {$wpdb->usermeta} WHERE meta_key = 'lcj_auth_token'"
        );
        
        foreach ($users_with_tokens as $user_data) {
            $stored_data = maybe_unserialize($user_data->meta_value);
            
            if (is_array($stored_data) && 
                isset($stored_data['token']) && 
                $stored_data['token'] === $token) {
                
                $result['found_serialized'] = true;
                $result['user_id_serialized'] = $user_data->user_id;
                break;
            }
        }
    }
    
    return $result;
}

// Garantir que a API REST esteja habilitada
add_filter('rest_enabled', '__return_true');
add_filter('rest_jsonp_enabled', '__return_true');

// Adicionar filtro para tokens
add_filter('rest_authentication_errors', function($result) {
    // Permitir que as verificações internas de permissão continuem
    return $result;
});

// Para depuração, exibir a versão do WordPress no rodapé do admin
add_action('admin_footer', function() {
    if (current_user_can('manage_options')) {
        echo '<div style="text-align: center; margin-top: 20px; color: #666;">LCJ API integrada | WordPress ' . get_bloginfo('version') . ' | PHP ' . phpversion() . '</div>';
    }
});

// Adicionar admin notice para mostrar status da integração
add_action('admin_notices', function() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    echo '<div class="notice notice-success is-dismissible">';
    echo '<p><strong>LCJ API</strong>: Integração OAuth configurada. Endpoints REST disponíveis em: <code>/wp-json/lcj/v1/</code></p>';
    echo '</div>';
});