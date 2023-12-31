const { User, User_profile, Sequelize } = require('../models')
const { v4: uuidv4 } = require('uuid')
const { sign, verify } = require('jsonwebtoken')
const { genSalt, hash, compare } = require('bcrypt')
const { Op } = require('sequelize')

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const randomUUID = uuidv4();
    const randomUUIDUserProfile = uuidv4();

    const user = await User.findAll({
      where: { email: email }
    })
    
    if (user[0]) {
      // check if email is available in database
      res.status(422).json({
        status: 422,
        message: 'email is registered',
      })
    } else {
      // check password minimal 8 chacarter, 1 uppercase, 1 lowercase, 1 number, and 1 symbol
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ status: 400, message: 'Password harus minimal 8 karakter, memiliki setidaknya 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 karakter simbol seperti @$!%*?&#' });
      } else {
        // generate account
        const salt = await genSalt()
        const hashPassword = await hash(password, salt)

        await User.create({
          uuid: randomUUID,
          email: email,
          password: hashPassword,
          username: ''
        })

        await User_profile.create({
          uuid: randomUUIDUserProfile,
          uuid_user: randomUUID,
          fullname: '',
          category: '',
          profile_picture: '',
          address: '',
          work: '',
          link: '',
          biodata: '',
        })
  
        res.status(200).json({
          status: 200,
          message: 'register successfully',
        })
      }
    }
} catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error register');
  }
}

const getAllUser = async (req, res) => {
  try {
    const user = await User.findAll()
    res.json({ status: 200, data: user })
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- get all user register');
  }
}

const getUser = async (req, res) => {
  try {
    const { username, uuid } = req.body

    // const user = await User.findAll({
    //   where: { uuid: uuid }
    // })

    const user = await User.findAll({
      where: {
        email: {
          [Op.like]: `%${username}%`
        }
      }
    })

    res.status(200).json({
      status: 200,
      data: user
    })
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get user');
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findAll({
      where: {
        [Sequelize.Op.or]: [
          { email: email },
          { username: email } // Mencari berdasarkan username jika email tidak ditemukan
        ]
      }
    })

    if (!user[0]) {
      return res.status(404).json({
        status: 404,
        message: 'email or username not found'
      });
    }

    const match = await compare(password, user[0].password)
    if(!match) return res.status(400).json({message: 'password is wrong'})


    const userId = user[0].id
    const userEmail = user[0].email

    const accessToken = sign({userId, userEmail}, process.env.SOCIALKITA_ACCESS_TOKEN, {
      expiresIn: '30s'
    })

    const refreshToken = sign({userId, userEmail}, process.env.SOCIALKITA_REFRESH_TOKEN, {
      expiresIn: '1d'
    })

    await User.update({refresh_token: refreshToken}, {
      where: { id: userId }
    })


    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 30,
      secure: true,
      sameSite: 'none',
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: 'none',
      // signed: true
    })

    res.header('Access-Control-Allow-Credentials', true);

    res.json({
      status: 200,
      message: 'login successfully',
    })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error login');
  }
}

const getRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(401)
    const user = await User.findAll({
      where: {
        refresh_token: refreshToken
      }
    })
    if(!user[0]) return res.sendStatus(403)
    verify(refreshToken, process.env.SOCIALKITA_REFRESH_TOKEN, (err, decoded) => {
      if(err) return res.sendStatus(403)
      const userId = user[0].id
      const userEmail = user[0].email
      const accessToken = sign({userId, userEmail}, process.env.SOCIALKITA_ACCESS_TOKEN, {
        expiresIn: '30s'
      })

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 30,
        secure: true,
        sameSite: 'none',
      })

      res.json({
        status: 200,
      })
    })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get refresh token');
  }
}

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204)
    const user = await User.findAll({
      where: {
        refresh_token: refreshToken
      }
    })
    if(!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await User.update({refresh_token: null}, {
      where: {id: userId}
    })
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
    return res.status(200).json({ status: 200, message: 'logout successfully' })
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error logout');
  }
}

const getUserLogin = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  try {
    const user = await User.findAll({
      attributes: ['uuid', 'email', 'username'],
      where: {
        refresh_token: refreshToken
      }
    })
    const userProfile = await User_profile.findAll({
      attributes: ['profile_picture'],
      where: {
        uuid_user: user[0].uuid
      }
    })

    const data = {
      uuid: user[0].uuid,
      email: user[0].email,
      username: user[0].username,
      profile_picture: userProfile[0].profile_picture
    }

    return res.status(200).json({ status: 200, message: 'ok', data: data })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get user login');
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const { username } = req.body
    const refreshToken = req.cookies.refreshToken

    const user = await User.update({ username: username }, {
      where: {
        refresh_token: refreshToken
      }
    })

    res.status(200).json({ status: 200, message: 'ok' })
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get user login');
  }
}

module.exports = { registerUser, getUser, getAllUser, loginUser, getRefreshToken, logoutUser, getUserLogin, updateUserProfile }