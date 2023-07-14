# Labeddit Backend
Labeddit é uma rede social que promove interação entre usuários.

## Recursos

- Criar e deletar posts
- Like e dislike em posts
- Criar e deletar comentários
- Cadastro e login usando autenticação JWT

## Instalação

git clone https://github.com/Rebeccix/Labeddit-Backend.git
cd nome_da_pasta
npm install

## Configuração

1. Renomeie o arquivo .env.example para .env.
2. Abra o arquivo .env em um editor de texto.
3. Preencha as seguintes variáveis:

   - DB_FILE_PATH: Caminho para o DB.
   - JWT_KEY: A senha do JWT.
   - JWT_EXPIRES_IN: O tempo de duração do token do JWT.
   - BCRYPT_COST: Custo do bcrypt.

## Uso

npm start

Acessar a API do Labeddit em http://localhost:<PORTA>/, onde <PORTA> é a porta configurada no arquivo .env.

## Rotas da API

- POST /signup: Rota para criar um novo usuário. Envie um JSON contendo name, email e password.
- POST /login: Rota para realizar o login de um usuário existente. Envie um JSON contendo email e password.
- GET /posts: Rota para obter todos os posts.
- POST /posts: Rota para criar um novo post. Envie um JSON contendo content, além do token de autenticação no cabeçalho Authorization.
- PUT /posts/:id/like: Rota para dar um like ou dislike do post. Envie um JSON contento idPostToLikeDislike e like, além do token de autenticação no cabeçalho Authorization.
- DEL /posts/:id: Rota para deletar post. Envie um JSON contento id, além do token de autenticação no cabeçalho Authorization.
- GET /commentary/:id: Rota para obter todos os comentários de um post específico.
- POST /commentary/:id: Rota para criar um novo comentários. Envie um JSON contendo content e id, além do token de autenticação no cabeçalho Authorization.
- PUT /commentary/:id/like: Rota para dar um like ou dislike do comentários. Envie um JSON contento idCommentaryToLikeDislike e likeOrDislike, além do token de autenticação no cabeçalho Authorization.
- DEL /commentary/:id: Rota para deletar comentários. Envie um JSON contento id, além do token de autenticação no cabeçalho Authorization.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma pull request com melhorias, correções de bugs ou novos recursos.
