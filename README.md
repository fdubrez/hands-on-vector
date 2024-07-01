# "hands on" Vector Breizhcamp 2k24

Je pars du principe que vous avez vector et docker d'installé.

Lancer les différents éléments en parallèle.

```shell
# lancer le serveur node
cd server
npm install && node index.js

# lancer la prez reveal.js
cd slides
npm run start

# générer des logs
docker run --name generate_logs --rm -v $PWD/vector/generate_logs.py:/tmp/generate_logs.py -it python:slim python /tmp/generate_logs.py --interval 2 --format apache

# lancer vector sur le fichier de conf en mode "watch
cd vector
vector -c vector.yaml -w
```

La conf vector est mise à jour au changement de certains slides/fragments.

![schema](./slides/dist/img/diagram.png)

## références

J'ai récupéré le style terminal dans ce [codepen](https://codepen.io/robinselmer/pen/vJjbOZ) de robinselmer. 

La plupart des captures ou images sont issues de la doc officielle de Vector: https://vector.dev

