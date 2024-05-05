import { services } from '@/public/assets/data/services'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Services() {
  return (
    <>
    <div className="Services">
        <div className="container">
            <h2 className="text-center mt-1">Our Medical Service</h2>
            <div className="df">
        <p className='mt-3 text-center col-md-5'>World-class care for everyone.Our health System offers unmatched, expert health care</p>
        </div>
        <div className="row mt-5">
            {
                services.map((item,index)=>(
                    <div className="col-lg-4 col-md-6 mt-4" key={index} data-aos='zoom-out'>
                        <h4 className='mt-2'>{item.name}</h4>
                        <p className='mt-2'>{item.desc}</p>
                     <div className="df ">
                     <div className="crc mt-4 d ">
                    <FontAwesomeIcon icon={faArrowRight} size='lg' color='#181b1d' className='ica'/>
                    
                    </div>
                    <div className="num" style={{backgroundColor:item.bgColor}}>
                        <span style={{color:item.textColor}}>{item.num}</span>
                    </div>
                     </div>
                    </div>
                ))
            }
        </div>
        </div>
    </div>
    </>
  )
}

export default Services