// microframwork para rotas //
const express = require('express');
// id unico e universal e pssar string para retorna se o id é valido 
const {uuid, isUuid } = require('uuidv4');  
// conectar o backend com o frontend // 
const cors = require('cors');

const app = express();

// permitir qualquer url ou frontend tenha acesso ao nosso backend
app.use(cors());
// ler as requisiçoes em json
app.use(express.json()); 

const projects = [];
// mostra metodos e rotas de cada uma das requisição no backend //
function logrequest(request, response, next){
//  pegar metodos de dentro de request eual rota esta sendo chamada na aplicação //
const {method, url} = request;
// converter os metodos em caixa alta //
const loglabel = `[${method.toUpperCase()} ${url}]`;

console.log(loglabel);

return next(); // proximo middleware
}
// usada para validar se o id é valido
function validarprojeto(request, response, next){ // 
  const {id} = request.params;
// se nao for o id retorna status erro //
  if(!isUuid(id)){
    return response.status(400).json({error: 'id do projeto invalido'});
  }
  return next();
}

app.use(logrequest);
//usar o middleware apenas nas rotas que tiver essa url projects //
app.use('/projects/:id',validarprojeto);

app.get('/projects', /*logrequest*/  (request, response)=>{ //usando o middleware apenas na rota get //
 const {title} = request.query;

 // titulo preenchido pelo o usuario a variavel results vai filtrar algo de projects
// e verificar se no titulo do projeto inclui a palavra que ta dentro de title //
// e se for vazios o results sao a mesma coisa que os projects;
const results  = title 
? projects.filter(project => project.title.includes(title))
: projects;

 return response.json( results );
});
app.post('/projects', (request, response)=>{

  const { title, owner} = request.body;

  const project = {id: uuid(), title, owner}; // ID UNICO UNIVERSAL//

  projects.push(project); // push joga informaçoes para projects e adiciona no final do array//

  return response.json(project); // sempre passa o projeto recem criado //
});
app.put('/projects/:id', (request, response)=>{

  const {id} = request.params;
  const { title, owner} = request.body;

// procurar a posição da  informação dentro do array//
const projectIndex = projects.findIndex(project => project.id === id); 
  
if(projectIndex < 0){
   // status é uma função que recebeu um parametro//
  return response.status(400).json({error: 'nao achou a posição poxa'});
}

  
 // criar uma nova informação do projeto//

 const project = {
   title,
   owner,
   id
 };
 // procurar no projects na posição ProjectIndex e substituir pelo o project que acabou de ser criado acima//
 projects[projectIndex] = project;
  return response.json( project); // retorno do projeto atualizado//
});

app.delete('/projects/:id', (request, response)=>{
const {id} = request.params;
// encontrar o indice do projeto dentro do array //
// se nao existir retorno um erro com status 400 //
const projectIndex = projects.findIndex(project => project.id === id); // procurar a posição da  informação dentro do array//
  
if(projectIndex < 0){
  // status é uma função que recebe um  parametro//
  return response.status(400).json({error: 'nao achou a posição'}); 
}
 // remove apenas a posição que esta contida nesse indice //
projects.splice(projectIndex, 1)
// quando é o metodo delete deixa envia apenas um estatus de sucess //
  return response.status(204).send(); 
});
app.listen(3333, ()=> {
  console.log('🐱‍❤ backend started')
});