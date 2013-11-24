module.exports = function(app){
    var rpc = require('.././rpc');
    var modelServer = app.models.servers;

    return ServerController = {
        create: function(req, res){
            var newServer = modelServer({
                name: req.body.name,
                rpc_url: req.body.rpc_url,
                rpc_user: req.body.rpc_user,
                rpc_pass: req.body.rpc_pass,
                obs: req.body.obs,
                admin_email: req.body.admin_email
            });
            var valid = req.body.name && req.body.rpc_url;
            if (valid){
                newServer.save();
                res.send('Servidor adicionado com sucesso');
            }else {
                res.status(400).send({data: "Nome e URL sao obrigatorios"});
            }

        },
        getAll: function(req, res){
            modelServer.find({}, function(err, server){
                if(server){
                    res.send(server);
                }else{
                    res.send('Ainda não há servidores cadastrados');
                }
            })
        },
        executeAction: function(req, res){
            modelServer.findOne({_id:req.params.id}, function(err, server){
                if(server){
                    var processInfo = {};
                    var options = {"url": server.rpc_url, "basic_auth": {"user": server.rpc_user, "pass": server.rpc_pass } };
                    var client = rpc._actionProcess(options, req.body.process);
                    client._call( req.params.action + "Process", function(data){
                        client._call("getProcessInfo", function(process_info){
                            processInfo = process_info;

                            if (data && processInfo){
                                res.send({data: "Sucesso", process_info: processInfo});
                            }else{
                                res.status(404).send({data: "Erro alterando status de processo, por favor tente novamente"});
                            }
                        });
                    });
                }else{
                    res.send('Este servidor não existe, por favor verifique.');
                }
            })
        },
        getById: function(req, res){
            modelServer.findOne({_id:req.params.id}, function(err, server){
                if(server){
                    res.send(server);
                }else{
                    res.status(404).send({data:'Servidor nao encontrado'});
                }
            })
        },
        getProcessById: function(req, res){
            modelServer.findOne({_id:req.params.id}, function(err, server){
                if(server){
                    console.log("Server found, accessing xmlrpc");
                    options = {"url": server.rpc_url, "basic_auth": {"user": server.rpc_user, "pass": server.rpc_pass } };
                    var client = rpc._get_client(options);
                    client._call("getAllProcessInfo", function(data){
                        if (data){
                            res.send(data);
                        }else{
                            res.status(404).send({data: "Erro ao acessar lista de processos"});
                        }
                    });
                }else{
                    res.status(404).send({data:'Servidor nao encontrado'});
                }
            })
        },
        update: function(req, res){
            modelServer.findOne({_id: req.body._id}, function(err, server){
                if (server){
                    server.name = req.body.name;
                    server.rpc_url =  req.body.rpc_url;
                    server.rpc_user = req.body.rpc_user;
                    server.rpc_pass = req.body.rpc_pass;
                    server.obs =  req.body.obs;
                    server.admin_email = req.body.admin_email;
                    server.save();
                    res.send('Server editado com sucesso');
                }else{
                    res.send('Servidor não existe');
                }
            })
        },
        delete: function(req, res){
            modelServer.findOne({_id: req.params.id}, function(err, server){
                if(server){
                    server.remove();
                    res.send('Servidor removido com sucesso')
                }else{
                    res.send('Servidor não existe')
                }
            });
        }
    }

};
