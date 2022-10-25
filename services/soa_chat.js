import axios from 'axios'

const SOA_APP_ID='52d98b7d254f2f21651aaa0ca482e51b'
const SOA_SECRET_KEY='$2y$10$fQ04Pjp9h/ttlNi6IdeQ7OZ4EsH3dU0hhAgBgMBa0O1aqKGU/3rYG'
const SOA_CHAT_DOMAIN = 'https://dev28.onlinetestingserver.com/soachatapi/api'

export const AddUserSOA = async (id, name, image) =>
  await axios({
    url: `${SOA_CHAT_DOMAIN}/user/add`,
    method: 'POST',
    data: {
      appid: SOA_APP_ID,
      secret_key: SOA_SECRET_KEY,
      id,
      name: name,
      avatar: image,
    },
  })

export const LoginUserSOA = async (id) => {
  console.log('SOA_APP_ID, SOA_SECRET_KEY',SOA_APP_ID, SOA_SECRET_KEY,id)
  try {
    const loginUser = await axios({
      url: `${SOA_CHAT_DOMAIN}/login`,
      method: 'POST',
      data: {
        appid: SOA_APP_ID,
        secret_key: SOA_SECRET_KEY,
        id,
      },
    })
    console.log('LoginUserSOA',loginUser)
    return { token: loginUser.data.token, id: loginUser.data.data.id }
  } catch (error) {
    console.log('error',error)
  }
  
}

export const MakeFriendsSOA = async (toid, token) =>
  await axios({
    url: `${SOA_CHAT_DOMAIN}/user/add-friends`,
    method: 'GET',
    params: {
      toUid: toid,
      appid: SOA_APP_ID,
      auto_accept: true,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const GetMyFriendListSOA = async (page, token) => {
  const res = await axios({
    url: `${SOA_CHAT_DOMAIN}/user/get-my-friend-list-new?page=${page}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data.data.data
}

export const GetMessagesSOA = async (toid, page, token) => {
  const res = await axios({
    url: `${SOA_CHAT_DOMAIN}/chat/messages?page=${page}`,
    method: 'POST',
    data: {
      toid,
      group_id: '',
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  let data = res.data.data
  if (data.data.length > 0) {
    data.data.reverse()
  }
  return data
}

export const SendMessageSOA = async (toid, content, created_at, token) => {
  const { data } = await axios({
    url: `${SOA_CHAT_DOMAIN}/chat/save/messages`,
    method: 'POST',
    data: {
      toid,
      group_id: '',
      content,
      created_at,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
