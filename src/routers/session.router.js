import {Router} from 'express';
import passport from 'passport';

const sessionRouter= Router();

sessionRouter.get('/failRegister', (req,res)=>{
    res.send({error: 'Registration fails'});
})

sessionRouter.get('/failLogin', (req,res)=>{
    res.send({error: 'Login fails'});
})

sessionRouter.get('/github', passport.authenticate('github',(req, res)=>{

}));

sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/api/sessions/failLogin'},(req, res)=>{
    console.log("soy callback" + req.user)
    req.session.user=req.user;
    res.redirect('/');

}));

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failRegister'}), async(req,res)=>{
    res.redirect('/login');
})

sessionRouter.post('/login', passport.authenticate('login', {failureRedirect:'/api/sessions/failLogin'}), async(req,res)=>{
    if(!req.user){
        return res.status(400).send({status:'error', error : 'Invalid credentials'});
    }
    req.session.user={
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        age:req.user.age
    }
    res.redirect('/');
})

sessionRouter.get('/logout', async(req,res)=>{
    req.session.destroy(error=>{
        if (error){
            console.log(error);
            res.send(500).render('/errors/base', {error});
        }
        else{
            res.redirect('/login');
        }
    })
})





export default sessionRouter;