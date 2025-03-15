"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container py-10">
      <Card className="border-0 shadow-md">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">TERMOS E CONDIÇÕES</h1>
            <p className="text-sm text-gray-500 mb-8 text-center">Atualizado em 03 de Janeiro de 2024</p>

            <div className="space-y-8">
              {/* Índice */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-3">Índice</h2>
                <ul className="space-y-1">
                  <li>
                    <Link href="#bemvindo" className="text-primary hover:underline">
                      1. Seja bem-vindo!
                    </Link>
                  </li>
                  <li>
                    <Link href="#direitos" className="text-primary hover:underline">
                      2. Direitos autorais
                    </Link>
                  </li>
                  <li>
                    <Link href="#marcas" className="text-primary hover:underline">
                      3. Marcas registradas
                    </Link>
                  </li>
                  <li>
                    <Link href="#termos" className="text-primary hover:underline">
                      4. Termos de uso e licença de uso do site
                    </Link>
                  </li>
                  <li>
                    <Link href="#garantias" className="text-primary hover:underline">
                      5. Aviso sobre garantias e limite de responsabilidade
                    </Link>
                  </li>
                  <li>
                    <Link href="#violacao" className="text-primary hover:underline">
                      6. Violação dos termos de uso
                    </Link>
                  </li>
                  <li>
                    <Link href="#alteracoes" className="text-primary hover:underline">
                      7. Alterações
                    </Link>
                  </li>
                  <li>
                    <Link href="#lei" className="text-primary hover:underline">
                      8. Lei e jurisdição
                    </Link>
                  </li>
                  <li>
                    <Link href="#divisibilidade" className="text-primary hover:underline">
                      9. Divisibilidade de cláusulas
                    </Link>
                  </li>
                  <li>
                    <Link href="#acordo" className="text-primary hover:underline">
                      10. Acordo integral
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Conteúdo */}
              <section id="bemvindo" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Seja bem-vindo!</h2>
                <div className="space-y-4">
                  <p>
                    O objetivo deste site é ajudar você a aprender sobre o Direito de uma forma fácil, eficaz e nacional. 
                    Leia os artigos que você achar interessante. Nós queremos que outras pessoas também tirem proveito do nosso site. 
                    Mas pedimos que não reproduza o conteúdo dele em outros sites ou aplicativos. 
                    Você pode compartilhar com outros o que achou interessante por direcioná-los a este site, 
                    conforme instruções dos termos de uso abaixo.
                  </p>
                </div>
              </section>

              <section id="direitos" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Direitos autorais</h2>
                <div className="space-y-4">
                  <p>
                    © 2024 Laboratório de Ciências Jurídicas. Todos os direitos reservados.
                  </p>
                  <p>
                    Este site é publicado e mantido pela Empresa Laboratório de Ciências Jurídicas (LCJ). 
                    Salvo outra indicação, todos os artigos e outras informações contidas neste site são propriedade 
                    intelectual da Empresa Laboratório de Ciências Jurídicas (LCJ). Todos os direitos reservados.
                  </p>
                </div>
              </section>

              <section id="marcas" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Marcas registradas</h2>
                <div className="space-y-4">
                  <p>
                    A Adobe e seu logotipo, bem como a Acrobat e seu logotipo, são marcas registradas da Adobe Systems Incorporated. 
                    Apple, iTunes e iPod são marcas registradas da Apple Inc. A Microsoft e seu logotipo, bem como os nomes 
                    de qualquer software e produtos da Microsoft, incluindo o Microsoft Office e o Microsoft Office 365, 
                    são marcas registradas da Microsoft Inc. Android é uma marca registrada da Google LLC. O robô Android é 
                    reproduzido ou modificado a partir do trabalho criado e compartilhado pela Google e usado de acordo com 
                    os termos descritos na Licença de Atribuição do Creative Commons 3.0 (
                    <Link href="https://creativecommons.org/licenses/by/3.0/us/" className="text-primary hover:underline" target="_blank">
                      https://creativecommons.org/licenses/by/3.0/us/
                    </Link>
                    ). Todas as demais marcas e marcas registradas são propriedade de seus respectivos proprietários.
                  </p>
                </div>
              </section>

              <section id="termos" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Termos de uso e licença de uso do site</h2>
                <div className="space-y-4">
                  <p>
                    O uso deste site está sujeito a estes termos de uso. Por usar o site, você declara que concorda 
                    inteiramente com as condições descritas aqui, bem como com qualquer outro termo de uso (no plural, 
                    "termos de uso") estabelecido neste site. Se você não concorda com todos os termos de uso ou com 
                    qualquer parte deles, não use este site.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Como este site pode ser usado?</h3>
                  <p>Em concordância com as restrições descritas abaixo, você pode:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Visualizar, reescrever para uso próprio privado, de direito autoral da LCJ, deste site 
                      para uso pessoal e não comercial.
                    </li>
                    <li>
                      Compartilhar links ou cópias eletrônicas de artigos, que estão disponíveis para uso deste site.
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Você não pode:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Postar fotos, gravuras, publicações eletrônicas, marcas registradas, músicas, vídeos ou artigos 
                      deste site na Internet (o que inclui qualquer site, rede social e site de compartilhamento de 
                      arquivos e vídeos).
                    </li>
                    <li>
                      Distribuir fotos, gravuras, artigos eletrônicos, marcas registradas, músicas, textos ou vídeos 
                      deste site como parte de qualquer software ou aplicativo (o que inclui subir esses conteúdos 
                      para um servidor que é usado por um software ou um aplicativo).
                    </li>
                    <li>
                      Reproduzir, duplicar, copiar, distribuir ou usar de outro modo fotos, gravuras, artigos eletrônicos, 
                      marcas registradas, músicas, textos ou vídeos deste site para fins comerciais ou em troca de 
                      dinheiro (mesmo que não haja lucros envolvidos).
                    </li>
                    <li>
                      Criar, com o objetivo de distribuir, qualquer software, aplicativo, ferramenta ou técnica que 
                      sirva especificamente para colecionar, copiar, baixar, extrair ou rastrear dados, HTML, 
                      imagens ou textos deste site. (Isso não proíbe a distribuição gratuita, sem fins comerciais, 
                      de aplicativos projetados para baixar arquivos eletrônicos como EPUB, PDF, MP3 e arquivos MP4 
                      das áreas públicas deste site.)
                    </li>
                    <li>
                      Usar indevidamente este site ou os seus serviços. Por exemplo, interferir nele ou acessar o site 
                      e seus serviços por métodos que não sejam os claramente fornecidos.
                    </li>
                    <li>
                      Usar este site de um modo que cause, ou possa causar, danos a ele ou prejudicar a disponibilidade 
                      e a acessibilidade a ele. Também não deve ser usado de modo ilícito, ilegal, fraudulento ou 
                      prejudicial, ou para atividades e propósitos de caráter ilícito, ilegal, fraudulento ou prejudicial.
                    </li>
                    <li>
                      Usar este site ou quaisquer fotos, gravuras, artigos eletrônicas, marcas registradas, músicas, 
                      textos ou vídeos contidos nele para fins publicitários.
                    </li>
                  </ul>
                  
                  <p className="mt-4">
                    Este site utiliza os serviços do Google Maps, que é um serviço terceirizado sobre o qual não temos 
                    controle. Ao usar o Google Maps neste site, você estará sujeito aos atuais Termos Adicionais 
                    de Serviço do Google Maps/Google Earth. Nós não somos informados sobre as atualizações desses 
                    Termos de Serviço, portanto, verifique esses termos antes de utilizar os serviços do Google Maps. 
                    Não utilize os serviços do Google Maps se você não concorda com os Termos de Serviço. O Google Maps 
                    não reenvia nenhuma informação do usuário para o LCJ.
                  </p>
                </div>
              </section>

              <section id="garantias" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Aviso sobre garantias e limite de responsabilidade</h2>
                <div className="space-y-4">
                  <p>
                    Este site e toda informação, conteúdo, materiais e outros serviços disponíveis por meio dele são 
                    fornecidos pela LCJ na forma "tal qual". A LCJ não faz representações nem dá garantias de qualquer 
                    tipo, expressas ou implícitas.
                  </p>
                  <p>
                    A LCJ não garante que o site esteja livre de vírus ou outros componentes nocivos. A LCJ não se 
                    responsabilizará por danos de qualquer tipo que surjam pelo uso de qualquer serviço ou por quaisquer 
                    informações, conteúdos, materiais ou outros serviços disponíveis no site, incluindo, mas não se 
                    limitando a danos diretos, indiretos, acidentais, punitivos e outras consequências (incluindo danos monetários).
                  </p>
                </div>
              </section>

              <section id="violacao" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Violação dos termos de uso</h2>
                <div className="space-y-4">
                  <p>
                    Sem nenhum prejuízo aos demais direitos que a LCJ possui sob estes termos de uso, se você violar 
                    qualquer uma das condições declaradas aqui, a LCJ se reserva o direito de tomar as medidas que achar 
                    necessárias. Entre elas, suspender o seu acesso ao site, proibir você de acessar o site, bloquear o 
                    acesso de computadores que usem o seu número de IP, contatar seu provedor de internet para que ele 
                    bloqueie o seu acesso ao site e/ou tomar providências jurídicas contra você.
                  </p>
                </div>
              </section>

              <section id="alteracoes" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Alterações</h2>
                <div className="space-y-4">
                  <p>
                    A LCJ pode revisar periodicamente os termos de uso. Os termos atualizados passarão a vigorar no 
                    instante em que forem publicados no site. Por isso, visite regularmente esta página para estar 
                    sempre informado das mudanças mais recentes.
                  </p>
                </div>
              </section>

              <section id="lei" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Lei e jurisdição</h2>
                <div className="space-y-4">
                  <p>
                    Estes termos de uso serão regidos e interpretados de acordo com as leis de Angola, independentemente 
                    de conflitos de cláusulas legais. Qualquer ação jurídica relacionada a estes termos de uso deve ser 
                    apresentada a um tribunal que tenha jurisdição no Estado angolano.
                  </p>
                </div>
              </section>

              <section id="divisibilidade" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Divisibilidade de cláusulas</h2>
                <div className="space-y-4">
                  <p>
                    Se um tribunal com a devida jurisdição declarar que alguma cláusula destes termos de uso é nula, 
                    inválida, ilegal ou inaplicável, as outras cláusulas continuarão em vigor. Se a LCJ falhar em fazer 
                    valer alguma cláusula destes termos de uso, isso não significa que o usuário esteja isento de 
                    cumpri-la ou que a LCJ não tenha o direito de fazê-la valer.
                  </p>
                </div>
              </section>

              <section id="acordo" className="scroll-mt-16">
                <h2 className="text-xl font-bold mb-4">Acordo integral</h2>
                <div className="space-y-4">
                  <p>
                    Estes termos de uso são o acordo integral entre a LCJ e você no que diz respeito ao uso do site. 
                    Qualquer acordo anterior relacionado ao uso do site está anulado.
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