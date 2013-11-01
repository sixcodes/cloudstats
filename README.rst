Build
=====

Na raiz do projeto:

$ npm install
$ bower install

depois entra em

app/bower_components/boostrap-ui e roda

$ npm install
$ grunt build

Agora todas as referências que o app/index.html faz estarão resolvidas

Preparando os staticos
======================

Entre em public/ e rode

$ ln -s ../app/* .

Agora o nodejs ja servira os estaticos da app frontend


