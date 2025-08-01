const { render } = require('ejs');
const User = require('../model/user');

//show signup
exports.getSignupForm = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
};

// handle signup
exports.signup = async (req, res) => {
  const { first_name, last_name, gender, email, password, mobile_number } = req.body;
  
  try{
    const existingUser = await User.findOne({email});
    if (existingUser){
        return res.render('signup',{ title: 'Sign Up', error: 'Email already registered.' });
    }
    const newUser = new User({
        first_name,
        last_name,
        gender,
        email,
        password,
        mobile_number,
        isAdmin: false,
        createdAt: new Date()
    });

    await newUser.save();
    res.render('login');
  } catch(err){
    console.error(err);
    res.render('signup',{ title: 'Sign Up', error: 'Server error. Please try again.' });
  }
};

//show login
exports.getLoginForm = (req, res) => {
  res.render('login');
};

//handle login
exports.login = async (req,res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.findOne({email});
        if (!user || user.password !== password){
            return res.render('logIn', { error: 'Invalid email or password.' });
        }
         req.session.user = {
            id: user._id,
            name: user.first_name,
            email: user.email,
            isAdmin: user.isAdmin
        }
        res.redirect('/');
    } catch (err){
        console.error(err);
        res.render('logIn', { error: 'Server error. Please try again.' });
    }
};
//handle logout
exports.logout = (req, res) => {
    req.session.destroy(err=>{
        if (err){
            console.error(err);
        }
        res.redirect('/');
    });
};