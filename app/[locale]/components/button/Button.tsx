import Link from 'next/link'
import styles from './Button.module.scss'

type Props = {
  children: React.ReactNode
  href: string
  className?: string
}

const Button = ({ children, href, className }: Props) => {
  return (
    <Link href={href} className={`${styles.btn} ${className || ''}`} target='_blanc'>{children}</Link>
  )
}

export default Button