import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Howitworks() {
    const WorksData = [
        {
            img:'/assets/images/icon01.png',
            title:'Find Doctor',
            descrip:'World-class care for everyone.Our health System offers unmatched, expert health care,From lab to clinic'
        },
        {
            img:'/assets/images/icon02.png',
            title:'Find Location',
            descrip:'World-class care for everyone.Our health System offers unmatched, expert health care,From lab to clinic'
        },
        {
            img:'/assets/images/icon03.png',
            title:'Book Appoinment',
            descrip:'World-class care for everyone.Our health System offers unmatched, expert health care,From lab to clinic'
        },
    ]
  return (
   <>
   <div className="Works">
    <div className="container p-lg-0">
        <div className="df ">
        <h2 className='text-center mt-2'>Providing the best medical services</h2>
        </div>
        <div className="df">
        <p className='mt-3 text-center col-md-5'>World-class care for everyone.Our health System offers unmatched, expert health care</p>
        </div>
        <div className="row mt-4 df ">
            {
                WorksData.map((item,index)=>(
                    <div className="col-md-4 mt-2" key={index}  data-aos="zoom-in">
                        <img src={item.img} alt={item.title} className='img-fluid'/>
                    <h4 className='text-center mt-4'>{item.title}</h4>
                    <p>{item.descrip}</p>
                    <div className="crc mt-4 df">
                    <FontAwesomeIcon icon={faArrowRight} size='lg' color='#181b1d' className='ica'/>
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

export default Howitworks