require('../models/database');
//const { updateMany } = require('../models/Category');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET /
 * Homepage
 */
exports.homepage = async(req,res)=> {

try {
    const limitNumber = 40;
    const categories=await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese'  }).limit(limitNumber);
    const indian = await Recipe.find({ 'category': 'Indian'  }).limit(limitNumber);
    const italian = await Recipe.find({ 'category': 'Italian'  }).limit(limitNumber);
    const baked  = await Recipe.find({ 'category': 'Baked Goods'  }).limit(limitNumber);
    const fast = await Recipe.find({ 'category': 'Fast Food'  }).limit(limitNumber);


    const food = {latest , chinese , indian , italian , baked, fast };  

    res.render('index',{title: 'Food Blog-Home', categories,food });

} catch (error) {
    
    res.status(500).send({message:error.message || "Error Occured"});

    }
}
/**
 * GET / categories
 * Categories
 */
 exports.exploreCategories = async(req,res)=> {

    try {
        const limitNumber = 40;
        const categories=await Category.find({}).limit(limitNumber);
    
        res.render('categories',{title: 'Food Blog-Categories', categories });
    
    } catch (error) {
        
        res.status(500).send({message:error.message || "Error Occured"});
    
            }
    
    }


    /**
 * GET / categories /:id
 * Categories by id
 */
 exports.exploreCategoriesById = async(req,res)=> {

    try {
        let categoryId= req.params.id;
        const limitNumber=40;
        const categoryById=await Recipe.find({'category': categoryId}).limit(limitNumber);
    
        res.render('categories',{title: 'Food Blog-Categories', categoryById });
    
    } catch (error) {
        
        res.status(500).send({message:error.message || "Error Occured"});
    
            }
    
    }




    /**
 * GET / Recipe.:id
 * Recipe
 */
 exports.exploreRecipe = async(req,res)=> {

    try {
        let recipeId = req.params.id;

        const recipe= await Recipe.findById(recipeId);
    
        res.render('recipe',{title: 'Food Blog-Recipe',recipe });
    
    } catch (error) {
        
        res.status(500).send({message:error.message || "Error Occured"});
    
            }
    
    }



        /**
 * GET / explore-latest
 * Explore Latest
 */
 exports.exploreLatest = async(req,res)=> {

    try {
        const limitNumber=20;
        const recipe = await Recipe.find({}).sort({ _id: -1}).limit(limitNumber);
    
        res.render('explore-latest',{title: 'Food Blog-Explore Latest',recipe });
    
    } catch (error) {
        
        res.status(500).send({message:error.message || "Error Occured"});
    
            }
    
    }

/**
 * GET / explore-random
 * exploreRandom
 */
 exports.exploreRandom = async(req,res)=> {

    try {
       let count = await Recipe.find().countDocuments();
       let random = Math.floor(Math.random() * count);
       let recipe = await Recipe.findOne().skip(random).exec();
       
    
        res.render('explore-random',{title: 'Food Blog-Explore Latest',recipe });
    
    } catch (error) {
        
        res.status(500).send({message:error.message || "Error Occured"});
    
            }
    
    }









    /**
 * POST / search/:id
 * search 
 */
     exports.searchRecipe = async(req,res)=> {
     try {
         let searchTerm = req.body.searchTerm;

         let recipe = await Recipe.find({ $text:{$search: searchTerm, $diacriticSensitive: true}});
         res.render('search',{title: 'Food Blog-search', recipe});

     } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"});
         
     }
           
        
        } 
        
        /**
 * GET / submit-recipe
 * submit recipe
 */
 exports.submitRecipe = async(req,res)=> {
     const infoErrorsObj = req.flash('infoErrors');
     const infoSubmitObj = req.flash('infoSubmit');
 
    res.render('submit-Recipe',{title: 'Food Blog-Submit Recipe', infoErrorsObj, infoSubmitObj});

}
       /**
 * POST / submitRecipeOnPost
 * submit recipe
 */
        exports.submitRecipeOnPost = async(req,res)=> {

           try {
            
            let imageUploadFile;
            let uploadPath;
            let newImageName;
            if(!req.files || Object.keys(req.files).length === 0){
                console.log('No Files were uploaded.');
            } else{
                imageUploadFile = req.files.image;
                newImageName = Date.now() + imageUploadFile.name;
                uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

                imageUploadFile.mv(uploadPath,function(err){
                    if(err) return res.status(500).send(err);
                })
            }




            const newRecipe = new Recipe({
                name: req.body.name,
                description: req.body.description,
                email: req.body.email,
                ingredients: req.body.ingredients,
                category: req.body.category,
                image:newImageName
            });
           await newRecipe.save();
            req.flash('infoSubmit','Recipe has been added.')
            res.redirect('/submit-Recipe');
        } catch (error) {
            //res.json(error);
            req.flash('infoErrors', error);
            res.redirect('/submit-Recipe');
    }
}
  
  



/* async function insertDymmyCategoryData(){
    try{
        await Category.insertMany([
            {
                "name":"Chinese",
                "image":"chinese.jpg"
            }
        ]);
    }catch(error){
        console.log('err',+error)

    } 
}
insertDymmyCategoryData(); */


async function insertDymmyRecipeData(){
    try{
        await Recipe.insertMany([
           /*  {
                "name":"Baked Good-apple pie",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Baked",
                "image": "Baked Good-apple pie.jpg"
        
            },
            {
                "name":"Chinese-Sweet-and-Sour-Prawns",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Chinese",
                "image": "Chinese-Sweet-and-Sour-Prawns.jpg"
        
            },
            {
                "name":"Italian-Chicken-Alfredo",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Italian",
                "image": "Italian-Chicken-Alfredo.jpg"
        
            },
            {
                "name":"Baked Good-cookies",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Baked Goods",
                "image": "Baked Good-cookies.jpg"
        
            }, */
            /* {
                "name":"Chinese-Cashew-Chicken",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Chinese",
                "image": "Chinese-Cashew-Chicken.jpg"
        
            }, */
            /* {
                "name":"Indian-palak paneerChinese-Cashew-Chicken",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Indian",
                "image": "Indian-palak paneer.jpg"
        
            }, */
            /* {
                "name":"Italian-lasagna",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Italian",
                "image": "Italian-lasagna.jpg"
        
            }, */
           /*  {
                "name":"Fast Food-pasta",
                "description":'dsfhaskdfasdjfk',
                "email": "f2018266175@umt.edu.pk",
                "ingrediants": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Fast Food",
                "image": "Fast Food-pasta.jpg"
        
            }, */
            /* {
                "name":"Italian-Chicken_ravioli",
                "description":'nai btana',
                "email": "f2018266175@umt.edu.pk",
                "ingredients": [
                    "1 clove of garlic",
                    "1 fresh red chili",
                    "3 spring onions",
                ],
                "category": "Italian",
                "image": "Italian-Chicken_ravioli.jpg"
        
            } */
            

            
            
        ]);
    }catch(error){
        console.log('err',+error)

    }
}
insertDymmyRecipeData();