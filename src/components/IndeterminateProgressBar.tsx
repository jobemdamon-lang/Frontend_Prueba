import '../assets/sass/components/IndeterminateProgressBar.scss'

type color = 'blue' | 'red' | 'green'
const IndeterminateProgressBar = ({color}:{color: color}) => {
  return (
    <div className="demo-container">
      <div className={`progress-container progress-container-${color}`}>
        <div className={`progress-bar progress-${color}`}></div>
      </div>
    </div>
  )
}
export { IndeterminateProgressBar }

