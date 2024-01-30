const { List, Favorite, User } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize')
const midtransClient = require('midtrans-client');

class MangaController {

    static async manga(req, res, next){
        try {
            let {genre, search, sort} = req.query

            let config = `/ranking?ranking_type=all&limit=40&fields=id,title,main_picture,alternative_titles,start_date,end_date,num_list`

            if(search !== '' && typeof search !== 'undefined'){
                config = `?q=${search}&limit=10`
            }

            if(genre !== '' && typeof genre !== 'undefined'){
                config = `/ranking?ranking_type=${genre}&limit=10`
            }

            const { data } = await axios({
                url: `https://api.myanimelist.net/v2/manga` + config,
                method: `GET`,
                headers: {
                    'X-MAL-CLIENT-ID': process.env.CLIENT_ID_MAL
                }
            })
           
            if(sort !== '' && typeof sort !== 'undefined'){
                data.data.sort(function(a, b){
                    let keyA = a.node[sort],
                        keyB = b.node[sort];
                    // Compare the 2 dates
                    if(keyA < keyB) return -1;
                    if(keyA > keyB) return 1;
                    return 0;
                })
            }
            
            res
            .status(200)
            .json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async list(req, res, next){
        try {

            let UserId = req.user.id
            
            const findList = await List.findAll({
                where: {
                    UserId : UserId
                }
            })

            let listMangaId = findList.map(el => {
                return el.mangaId
            })


            res
                .status(200)
                .json(findList)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async getManga(req, res, next){
        try {
            let { mangaId } = req.body
            let config = `/${mangaId}?fields=?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,num_volumes,num_chapters,authors{first_name,last_name},background,related_anime,related_manga,recommendations,serialization{name}`
            let {data} = await axios({
                url: `https://api.myanimelist.net/v2/manga` + config,
                method: 'GET',
                headers: {
                    'X-MAL-CLIENT-ID': process.env.CLIENT_ID_MAL
                }
            })

            res
                .status(200)
                .json(data)
        } catch (error) {
            next(error)
        }
    }

    static async details(req, res, next){
        try {
            let { mangaId } = req.params
            let config = `/${mangaId}?fields=?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,created_at,updated_at,media_type,status,genres,num_volumes,num_chapters,authors{first_name,last_name},background,related_anime,related_manga,recommendations}`
            let {data} = await axios({
                url: `https://api.myanimelist.net/v2/manga` + config,
                method: 'GET',
                headers: {
                    'X-MAL-CLIENT-ID': '2a6233d5a9d85cceb5a54a6a894dda19'
                }
            })
            res
                .status(200)
                .json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async addToList(req, res, next){
        try {
            let UserId = req.user.id
            let { mangaId } = req.params
            const findUser = await User.findAll({
                where: {
                    id : UserId
                },
                include : [
                    {
                        model: List,
                    }
                ],
            })
           
            console.log(findUser[0].dataValues)
           findUser[0].dataValues.Lists.forEach(el=> {
                if(el.mangaId === +mangaId){
                    throw { name: "owned"}
                }
            })
            if(!findUser[0].dataValues.subscribe){
                throw { name : 'not_subs'}
            }
            let config = `/${mangaId}?fields=id,title,main_picture,media_type`
            let { data } = await axios({
                url: `https://api.myanimelist.net/v2/manga` + config,
                method: 'GET',
                headers: {
                    'X-MAL-CLIENT-ID': '2a6233d5a9d85cceb5a54a6a894dda19'
                }
            })
            
            let userList =  await List.create({
                title: data.title,
                mangaId: data.id,
                UserId: UserId,
                imageUrl: data.main_picture.medium,
                type: data.media_type
            })
            
            res
                .status(200)
                .json(userList)
        } catch (error) {
            next(error)
        }
    }

    static async addToFavorite(req, res, next){
        try {
            let UserId = req.user.id
            let { mangaId } = req.params
            let config = `/${mangaId}?fields=id,title,main_picture,media_type`
            let { data } = await axios({
                url: `https://api.myanimelist.net/v2/manga` + config,
                method: 'GET',
                headers: {
                    'X-MAL-CLIENT-ID': '2a6233d5a9d85cceb5a54a6a894dda19'
                }
            })

            let userFav =  await Favorite.create({
                    mangaId: data.id,
                    UserId: UserId
                })
            
            res
                .status(200)
                .json(userFav)
        } catch (error) {
            next(error)
        }
    }

    static async removeFromFavorit(req, res, next){
        try {
            let id = req.params.id
            
            let data = await Favorite.destroy({
                where: {
                    id
                }
            })
        res 
            .status(200)
            .json('Manga has been removed from list')
        } catch (error) {
            next(error)
        }
    }

    static async removeFromList(req, res, next){
        try {
            let id = req.params.id
            
            let data = await List.destroy({
                where: {
                    id
                }
            })
        res 
            .status(200)
            .json('Manga has been removed from list')
        } catch (error) {
            next(error)
        }
    }

    static async getMidtransToken(req, res, next){
        try {
            const user = await User.findByPk(req.user.id)
            
            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction : false,
                serverKey : process.env.SERVER_KEY_MIDTRANS
            });
            let parameter = {
                "transaction_details": {
                    order_id: "ORDERID-" + Date.now() + Math.floor(Math.random() * 9000000),
                    gross_amount: 10000
                },
                "credit_card":{
                    secure : true
                },
                "customer_details": {
                    email: user.email,
                    phone : user.phoneNumber
                }
            };
            const midtransToken = await snap.createTransaction(parameter)
            console.log(midtransToken)
            res 
                .status(201)
                .json(midtransToken)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = MangaController