# Instruções úteis

`pip install -r requirements.txt`

`python manage.py flush` - Apaga as linhas da BD

`python manage.py migrate` - É preciso (ou convém) correr após apagar a BD

## Elastic Search setup (docker)

### Image Download

`docker run --name elastic --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.13.0`

**If the above command doesn't run image properly then do vm_max_count fix:**

`wsl -d docker-desktop`

`sysctl -w vm.max_map_count=262144`

[Useful Link](https://stackoverflow.com/questions/56937171/efk-elasticsearch-1-exited-with-code-78-when-install-elasticsearch)

## Change password

`docker exec -it <nome container> /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic -i dG_V0drZ3sT2FT1OkcNR`

### Load fixtures

`python manage.py load_fixtures fixtures/seed` - Povoa a BD

`python manage.py runserver` - "Corre" servidor

`python manage.py search_index --rebuild` - Recria o índice de pesquisa, correr quando se alterar documents.py

Autenticação:
- usernames: 
joao@mail.com
user1@mail.com
user2@mail.com
- password: 123