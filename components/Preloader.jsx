import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Preloader() {
  return (
    <div className="absCenter ">
    <div className="loaderPill">
        <div className="loaderPill-anim">
            <div className="loaderPill-anim-bounce">
                <div className="loaderPill-anim-flop">
                    <div className="loaderPill-pill"></div>
                </div>
            </div>
        </div>
        <div className="loaderPill-floor">
            <div className="loaderPill-floor-shadow"></div>
        </div>
        {/* <div className="d-flex align-items-center justify-content-center"><FontAwesomeIcon icon={faPlus} className='my-p mt-2' size='2xl' color='#0067ff' style={{fontWeight:'bolder'}}/> <h3>Rizvi Medic</h3></div> */}
    </div>
</div>
  )
}

export default Preloader