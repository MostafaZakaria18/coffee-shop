//const { render } = require('ejs');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;


//show signup
exports.getSignupForm = (req, res) => {
    res.render('signup', { 
        title: 'Sign Up',
        error: null,
        success: null });
};

// handle signup
exports.signup = async (req, res) => {
  const { first_name, last_name, gender, email, password, mobile_number } = req.body;
  
  try{
    if (!emailRegex.test(email)){
        return res.render('signup', {
        title: 'Sign Up',
        error: 'Invalid email format.',
        success: null,
      });
    }

     if (!passwordRegex.test(password)) {
      return res.render('signup', {
        title: 'Sign Up',
        error: 'Password must include uppercase, lowercase, number, symbol, and be at least 8 characters.',
        success: null,
      });
    }

    const existingUser = await User.findOne({email});
    if (existingUser){
        return res.render('signup',{ 
        title: 'Sign Up',
        error: 'Email already registered.' ,
        success: null,
    });
    }

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        first_name,
        last_name,
        gender,
        email,
        password: hashedPass,
        mobile_number,
        isAdmin: false,
        createdAt: new Date()
    });

    await newUser.save();
    return res.render('signup', { error: null, success: 'Account created successfully!' });
  } catch(err){
    console.error(err);
    res.render('signup',{ title: 'Sign Up', error: 'Server error. Please try again.', success: null });
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
        if (!user){
            return res.render('logIn', { error: 'Invalid email or password.' });
        }


        const match = await bcrypt.compare(password, user.password);
            // console.log("-------", user.password);
        if (!match){
            return res.render('login',{ error: 'Inavalid email or password!'});
        }
            // console.log("Entered Password:", password);
            // console.log("Stored Hash:", user.password);
            // console.log("Password Match:", match);

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