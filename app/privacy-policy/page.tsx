"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-10">
      <Card className="border-0 shadow-md">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">POLÍTICA DE PRIVACIDADE</h1>
            <p className="text-sm text-gray-500 mb-8 text-center">Atualizado em 03 de Janeiro de 2024</p>

            <div className="space-y-8">
              {/* Índice */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-3">Índice</h2>
                <ul className="space-y-1">
                  <li>
                    <Link href="#respeito" className="text-primary hover:underline">
                      1. RESPEITO PELA SUA PRIVACIDADE
                    </Link>
                  </li>
                  <li>
                    <Link href="#controlador" className="text-primary hover:underline">
                      2. INFORMAÇÕES SOBRE O CONTROLADOR DE DADOS
                    </Link>
                  </li>
                  <li>
                    <Link href="#seguranca" className="text-primary hover:underline">
                      3. SEGURANÇA DAS INFORMAÇÕES E CONFIDENCIALIDADE
                    </Link>
                  </li>
                  <li>
                    <Link href="#menores" className="text-primary hover:underline">
                      4. MENORES DE IDADE
                    </Link>
                  </li>
                  <li>
                    <Link href="#terceiros" className="text-primary hover:underline">
                      5. SERVIÇOS DE TERCEIROS
                    </Link>
                  </li>
                  <li>
                    <Link href="#notificacao" className="text-primary hover:underline">
                      6. NOTIFICAÇÃO SOBRE ALTERAÇÃO NAS POLÍTICAS
                    </Link>
                  </li>
                  <li>
                    <Link href="#javascript" className="text-primary hover:underline">
                      7. SCRIPT ACTIVO OU JAVASCRIPT
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Conteúdo */}
              <section id="respeito" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">RESPEITO POR SUA PRIVACIDADE</h2>
                <div className="space-y-4">
                  <p>
                    Nós protegemos e respeitamos sua privacidade. Esta Política mostra os procedimentos utilizados por nosso site e por todos os conteúdos associados e fornecidos pelo Laboratório de Ciências Jurídicas ("LCJ") para processar qualquer informação pessoal coletada por nós ou fornecida por você.
                  </p>
                  <p>
                    Quando você visita o nosso site, algumas informações pessoais básicas são mantidas no nosso banco de dados. Reconhecemos a importância de manter essas informações seguras e de informá-lo sobre como elas serão utilizadas.
                  </p>
                  <p>
                    Você pode escolher se vai ou não fornecer informações pessoais. Nesta Política, o termo "informações pessoais" se refere a informações como o seu nome, e-mail, endereço residencial, telefone ou qualquer outra informação utilizada para identificar você. O termo "site" inclui este site.
                  </p>
                </div>
              </section>

              <section id="controlador" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">INFORMAÇÕES SOBRE O CONTROLADOR DE DADOS</h2>
                <div className="space-y-4">
                  <p>
                    Este site e todos os conteúdos associados pertencem a LCJ, uma empresa de educação jurídica e resoluções de conflitos jurídicos. Se você decidir de forma voluntária abrir uma conta, fazer um pagamento, pedir uma visita ou realizar qualquer outra ação que envolva fornecer informações pessoais, você estará concordando com esta Política.
                  </p>
                  <p>
                    Também estará de acordo com o armazenamento de suas informações em servidores localizados em Angola e com a coleta, processamento, transferência e armazenamento de suas informações pessoais, conforme necessário para processar a ação que você realizou. Em conformidade com leis de proteção de dados.
                  </p>
                  <p>
                    O controlador de dados de suas informações pessoais varia de acordo com sua interação com o site. Por exemplo, se você fizer um pagamento para uma entidade legal de um determinado país, seu nome e informações de contato serão fornecidos a essa entidade, informada a você durante a operação.
                  </p>
                </div>
              </section>

              <section id="seguranca" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">SEGURANÇA DAS INFORMAÇÕES E CONFIDENCIALIDADE</h2>
                <div className="space-y-4">
                  <p>
                    Levamos muito a sério a segurança e a confidencialidade das suas informações. Utilizamos métodos atualizados de armazenamento e segurança para proteger suas informações pessoais contra acessos não autorizados, divulgação ou uso impróprios, modificações não autorizadas, destruição ilegal ou perda acidental.
                  </p>
                  <p>
                    Todos os processadores de informações pessoais e quaisquer terceiros que utilizemos para processar suas informações pessoais são obrigados a respeitar a confidencialidade de suas informações. Suas informações pessoais serão mantidas apenas pelo tempo necessário para cumprir os objetivos pelos quais foram coletadas ou qualquer obrigação legal ou norma referente à retenção de documentos.
                  </p>
                  <p>
                    Protegemos suas informações pessoais durante transferências utilizando protocolos de encriptação como o TLS (Transport Layer Security). Utilizamos sistemas de computador com protocolos de acesso limitado localizados em instalações que utilizam procedimentos e métodos de segurança físicos e eletrônicos para garantir a confidencialidade e a segurança das informações enviadas para nós.
                  </p>
                  <p>
                    Também mantemos rigorosos padrões de segurança para impedir qualquer acesso não autorizado.
                  </p>
                </div>
              </section>

              <section id="menores" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">MENORES DE IDADE</h2>
                <div className="space-y-4">
                  <p>
                    Se você é menor de idade no país em que está acessando o nosso site, você só pode fornecer informações pessoais no site com o consentimento do(s) seu(s) pai(s) ou responsável legal.
                  </p>
                  <p>
                    Se você é pai ou responsável e autoriza o menor a fornecer informações pessoais nesse site, você concorda com esta Política sobre o uso do site pelo menor.
                  </p>
                </div>
              </section>

              <section id="terceiros" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">SERVIÇOS DE TERCEIROS</h2>
                <div className="space-y-4">
                  <p>
                    Às vezes este site pode conter links para serviços de terceiros. Isso pode incluir links para sites de terceiros que foram contratados para prestar serviço (por exemplo, para o preenchimento de formulários on-line).
                  </p>
                  <p>
                    Um site de terceiros tem uma aparência diferente, e a barra de endereço do seu navegador também muda. Além disso, dependendo da solicitação que você fizer por esse site, você poderá receber e-mails ou mensagens de texto do terceiro com as informações solicitadas e notificações das atividades sobre as quais você solicitou informações.
                  </p>
                  <p>
                    Quando contratamos um serviço de terceiros, e depois periodicamente, sua política de privacidade e proteção de informações é analisada para assegurar de que estão sendo usados os mesmos padrões utilizados em nossas políticas. No entanto, nós não controlamos os termos de uso, programação, políticas de privacidade e condições gerais dos aplicativos e serviços fornecidos por esses terceiros.
                  </p>
                  <p>
                    Por este motivo, o uso de aplicativos e serviços de terceiros no site LCJ, está sujeito aos actuais termos de serviço e condições gerais definidos pelos terceiros. Nós não somos informados sobre essas atualizações, portanto, por favor, revise os termos antes de utilizar um serviço de terceiros neste site. Se você tiver alguma dúvida sobre a política de um serviço de terceiros, leia a política de privacidade em seu site.
                  </p>
                  <p>
                    O uso dos serviços do Google Maps neste site está sujeito à actual Política de Privacidade do Google. Não podemos controlar os aplicativos, programação e Termos de Serviço do Google. Por isso, quando você utilizar os serviços do Google Maps neste site você está sujeito aos atuais Termos Adicionais de Serviço do Google Maps/Google Earth. Nós não somos informados sobre as atualizações desses termos, portanto, por favor, revise esses termos antes de utilizar os serviços do Google Maps. Não utilize o Google Maps caso não aceite os termos de serviço estabelecidos por eles.
                  </p>
                </div>
              </section>

              <section id="notificacao" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">NOTIFICAÇÕES SOBRE ALTERAÇÕES NESTA POLÍTICA</h2>
                <div className="space-y-4">
                  <p>
                    Estamos sempre aprimorando e acrescentando novos recursos, ferramentas e serviços ao nosso site e a todos os aplicativos associados. Por causa dessas constantes mudanças, e de mudanças nas leis e na própria tecnologia, nosso uso de informações pode mudar de tempos em tempos.
                  </p>
                  <p>
                    Quando uma mudança na nossa Política é necessária, qualquer alteração realizada é postada nesta página para que você esteja ciente de que informações coletamos e como as usamos.
                  </p>
                </div>
              </section>

              <section id="javascript" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">SCRIPT ATIVO OU JAVASCRIPT</h2>
                <div className="space-y-4">
                  <p>
                    Utilizamos scripts para melhorar o desempenho do nosso site. A tecnologia de scripts nos permite retornar as informações de maneira mais rápida para você. Os scripts nunca são usados pelo site ou pelos aplicativos associados para instalar um software no seu computador ou para coletar informações suas sem a sua autorização.
                  </p>
                  <p>
                    Para nosso site, os recursos de Script ativo ou JavaScript devem estar habilitados no seu navegador a fim de que algumas partes do site funcionem corretamente. A maioria dos navegadores permite habilitar ou desabilitar esse recurso para sites específicos. Consulte a ajuda de seu navegador para saber como habilitá-lo.
                  </p>
                </div>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  © {new Date().getFullYear()} Laboratório de Ciências Jurídicas - LCJ. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}