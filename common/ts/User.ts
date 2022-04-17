import { ref } from 'vue'
import { srequest } from '@/api'

const User = ref()

srequest('/users/current').then(data => {
  User.value = data
})

export default User
