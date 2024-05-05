import React from 'react'

function About() {
    return (
        <>
            <div className="About">
                <div className="container ">
                    <div className="row">
                        <div className="col-md-6 " data-aos='flip-left'>
                            <div className="about-img">
                                <img src="/assets/images/about.png" alt="Rizvi Medic" className='img-fluid i1' />
                                <div className="abt-img">
                                    <img src="/assets/images/about-card.png" alt="Rizvi Medic" className='img-fluid' />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-2" data-aos='flip-left'>
                            <h2 className='text-ceter'>Proud to be one of the nations best</h2>
                            <p className='mt-3'>For 30 years in a row, U.S. News & World Report has recognized us as one of the
                                best publics hospitals in the Nation and #1 in Texas. Lorem ipsum dolor sit
                                amet consectetur, adipisicing elit. Quas, nemo?</p>
                            <p className='mt-5'>Our best is something we strive for each day, caring for our patients-not
                                looking back at what we accomplished but towards what we can do tomorrow.
                                Providing the best. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                Aliquid, modi?</p>
                                <button className='btnpr mt-3'>Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About