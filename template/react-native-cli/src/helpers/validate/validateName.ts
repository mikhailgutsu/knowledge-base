interface IValidateName {
  name: string
  nameCannotBeEmpty: string
}

export const validateName = (props: IValidateName) => {
  const { name, nameCannotBeEmpty } = props

  if (!name || name.length <= 0) return nameCannotBeEmpty
  return ''
}
