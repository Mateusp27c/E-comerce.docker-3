	cp .env.example .env + docker compose up --build 
  sobe sem erro	
  POST cria, GET devolve, id inexistente dá 404
 A imagem node:22-alpine seguiu todos os passos do Dockerfile: OpenSSL, npm ci, prisma generate e npm start. O postgres:16-alpine subiu com o usuário, a senha e o banco do compose.yaml, e o teste de saúde deu "pronto" em 3 s. A API leu o .env e achou o banco pelo nome banco. Depois criou as tabelas, cadastrou os produtos e mostrou "Server rodando".
 1. Baixar o projeto e criar o .env
git clone <link-do-repositorio>
cd p3-ecommerce-docker
cp .env.example .env
O .env já vem pronto: APP_ENV=dev e o DATABASE_URL apontando para o serviço banco do Compose.

2. Subir tudo
docker compose up --build
O Compose sobe dois serviços:

banco: PostgreSQL 16. Não publica porta, então só a API acessa o banco, pela rede interna do Compose.
api: a aplicação Node. Ela só inicia depois que o banco passa no healthcheck (depends_on com service_healthy). Ao iniciar, cria as tabelas (prisma db push), cadastra os produtos (seed) e sobe o servidor.
A API está pronta quando aparecer Server rodando em http://localhost:3000.

3. Testar
Em outro terminal, crie um pedido:

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "cliente@ethereal.email",
    "items": [{ "productId": 1, "quantity": 1 }],
    "paymentMethod": "pix"
  }'

  A resposta traz o orderId. Busque o pedido por esse id:



curl -i http://localhost:3000/orders/1      # 200 com o pedido
curl -i http://localhost:3000/orders/9999   # 404, pedido não existe



4. Parar e subir de novo


docker compose down      # para os containers; os pedidos ficam salvos no volume pgdata
docker compose up        # sobe de novo; o GET /orders/1 continua funcionando
docker compose down -v   # para e APAGA o volume (zera o banco)



Modos dev e test



Troque o valor de APP_ENV no .env e rode docker compose up --build de novo.





APP_ENV=dev (padrão): grava os pedidos no PostgreSQL e envia o e-mail pelo Ethereal. O link de visualização vem no campo emailPreview.


APP_ENV=test: guarda os pedidos em memória (somem ao reiniciar) e mostra o e-mail no console.
