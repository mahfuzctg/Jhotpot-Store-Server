
import bcrypt from 'bcrypt'

export const ComparePassword = async (
  plainPassword: string,
  hashPassword: string,
) => {
  const password = bcrypt.compare(plainPassword, hashPassword)
  return password
}
