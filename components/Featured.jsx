import React from 'react'

function Featured() {
  return (
    <>
      <div className="Featured ">
        <div className="container">
          <div className="row df">
            <div className="col-md-7">
              <div className="col-md-8">
                <h3 className='mx-4'>Get Virtual Treatment Anytime</h3>
              </div>
              <ul>
                <li  className='mt-3'>1. Schedule Appoinment directly</li>
                <li className='mt-3'>2. Search for physician here and contact for there office</li>
                <li className='mt-3'>3. View our physicians who are accepting new patients, use the online
                  scheduling tool to select an appointment time.</li>
              </ul>
              <button className='btnpr mt-2 mx-3'>Lean More</button>
            </div>
            <div className="col-md-5 mt-3">
              <img src="/assets/images/feature-img.png" alt="Rizvi Medic" className='img-fluid'/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Featured