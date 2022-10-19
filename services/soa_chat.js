import axios from 'axios'

const { SOA_APP_ID, SOA_SECRET_KEY } = process.env

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
  const loginUser = await axios({
    url: `${SOA_CHAT_DOMAIN}/login`,
    method: 'POST',
    data: {
      appid: SOA_APP_ID,
      secret_key: SOA_SECRET_KEY,
      id,
    },
  })
  return { token: loginUser.data.token, id: loginUser.data.data.id }
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
