import PropTypes from 'prop-types'
import { btnVariants } from '../../constants/customClass'

const ButtonPrimary = ({children, className, variant = 'primary', ...props}) => {
    return (
        <button className={`btn ${btnVariants[variant]} ${className}`} {...props}>
            {children}
        </button>
    )
}

ButtonPrimary.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    variant: PropTypes.string
  }

export default ButtonPrimary