# Tauge Tecnologia — site institucional

Site estático multipágina, sem dependências de instalação.

## Como visualizar

Opção rápida:

1. Abra `index.html` no navegador.

Opção recomendada para testar formulários, navegação e SEO local:

1. Abra um terminal nesta pasta.
2. Execute `python -m http.server 4173`.
3. Acesse `http://localhost:4173`.

## Estrutura

- `index.html`: página inicial.
- `empresa.html`: apresentação institucional.
- `solucoes.html`: detalhamento das soluções.
- `clientes.html`: perfis de operação e experiência.
- `contato.html`: canais e formulário.
- `privacidade.html`: base da política de privacidade.
- `termos.html`: base dos termos de uso.
- `css/site.css`: design system e responsividade.
- `js/site.js`: navegação, animações e formulário.
- `robots.txt` e `sitemap.xml`: indexação.

## Formulário

O formulário valida os campos e prepara uma mensagem no aplicativo de e-mail do visitante. Para envio direto e acompanhamento de conversões, será necessário conectar um serviço de formulário ou uma API no ambiente de produção, sem expor credenciais no front-end.

## Confirmações antes da publicação

- Validar formalmente fundação em 2003, atuação nacional e escopo do atendimento 24x7.
- Confirmar telefone, e-mail, endereço completo e redes sociais.
- Confirmar autorização para citar tecnologias e divulgar clientes, cases ou quantidade de marcas atendidas.
- Revisar Política de Privacidade e Termos de Uso com assessoria jurídica.
- Definir o backend definitivo do formulário.
