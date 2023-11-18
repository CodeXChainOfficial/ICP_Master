import { ReactNode } from "react"

export interface LinkItemProps {
  name?: string
  content?: ReactNode
  className?: string
  href?: { href?: string; target?: string; pathname?: string }

  /** You can use this or the getList function if you want list to be dynamic */
  list?: LinkItemProps[]

  /** getList function has higher priority over list field */
  getList?: (props: { pathname: string }) => LinkItemProps[]

  onClick?: () => void
}
