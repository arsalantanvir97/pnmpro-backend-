import {
  MakeFriendsSOA,
  GetMyFriendListSOA,
  GetMessagesSOA,
  SendMessageSOA,
} from '../services/soa_chat'

const makeFriends = async (req, res) => {
  try {
    const { toid, token } = req.body

    await MakeFriendsSOA(toid, token)

    await res.status(201).json({
      message: 'OK',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const getFriends = async (req, res) => {
  try {
    const { token, page } = req.body

    const friends = await GetMyFriendListSOA(page, token)

    await res.status(200).json({
      friends,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const getMessages = async (req, res) => {
  try {
    const { toid, page, token } = req.body

    const messages = await GetMessagesSOA(toid, page, token)

    await res.status(200).json({
      messages,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const sendMessage = async (req, res) => {
  try {
    const { toid, content, created_at, token } = req.body

    const data = await SendMessageSOA(toid, content, created_at, token)

    await res.status(200).json({
      data: {
        toid,
        content,
        created_at,
        token,
      },
      toid,
      message: 'OK',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}
export { makeFriends, getFriends, getMessages, sendMessage }
