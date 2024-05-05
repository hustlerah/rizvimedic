import React from 'react'

function Hero() {
    return (
        <>
            <div className="Hero df">
                <div className="container p-md-0">
                    <div className="row">
                        <div className="col-lg-5 col-md-6"  data-aos="fade-right">
                            <h2>We help Pateints live a healthy, longer life</h2>
                            <p className='mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo quibusdam corrupti fugiat architecto saepe ullam commodi repellendus. Magni, doloremque ipsam nam error aut.</p>
                            <button className='btnpr mt-3' style={{ fontWeight: 'bold' }}>Request an Appionment</button>
                            <div className="hero-after d-flex mt-3">
                                <div className="heroc">
                                    <div class="underline-text"><h3>30+</h3></div>
                                    <span className='mx-2'>Years of Experience</span>
                                </div>
                                <div className="heroc">
                                    <div class="underline-text1"><h3>15+</h3></div>
                                    <span className='mx-2'>Clinic Locations </span>
                                </div>
                                <div className="heroc">
                                    <div class="underline-text2"><h3>100%</h3></div>
                                    <span className='mx-2'>Patient Satisfication</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6" data-aos="fade-left">
                            <div className="d-flex">
                                <div className="hero-img">
                                    <img src="/assets/images/hero-img01.png" alt="Rizvi Medic" className='img-fluid' />
                                </div>
                               <div className="d-block mx-3">
                               <div className="hero-img">
                                    <img src="/assets/images/hero-img02.png" alt="Rizvi Medic" className='img-fluid' />
                                </div>
                                <div className="hero-img mt-3">
                                    <img src="/assets/images/hero-img03.png" alt="Rizvi Medic" className='img-fluid' />
                                </div>
                               </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero