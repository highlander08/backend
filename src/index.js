const express = require('express');
const {uuid} = require('uuidv4'); 

const app = express();

app.use(express.json());


const projects = [];

app.get('/projects', (request, response)=>{
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