import React from 'react'

const TemplateTwoSectionAndLeftFourSaved = ({ content }) => {

    return (
        <div className='col-12 col-md-11 px-2 px-md-0'>
            {
                content.length > 0 ?
                    <div className="p-0 row template-images rounded">
                        <div className="col-6 rounded d-flex flex-column h-100 rounded">
                            <div className="row w-100 h-100 d-flex justify-content-center rounded mb-1">
                                <div className='col-6 rounded position-relative'>
                                    {
                                        content[0] && content[0].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[0].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[0].image.url} className='w-100 img-fluid rounded' alt={content[0].title} />
                                                </a>
                                            </div>
                                            :

                                            <></>
                                    }
                                </div>
                                <div className='col-6 rounded position-relative'>
                                    {
                                        content[1] && content[1].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[1].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[1].image.url} className='w-100 img-fluid rounded' alt={content[1].title} />
                                                </a>
                                            </div>
                                            :

                                            <></>
                                    }
                                </div>
                            </div>
                            <div className="row h-100 d-flex justify-content-center rounded">
                                <div className='col-6 rounded position-relative h-100'>
                                    {
                                        content[2] && content[2].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[2].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[2].image.url} className='w-100 img-fluid rounded' alt={content[2].title} />
                                                </a>
                                            </div>
                                            :

                                            <></>
                                    }
                                </div>
                                <div className='col-6 rounded position-relative h-100'>
                                    {
                                        content[3] && content[3].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[3].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[3].image.url} className='w-100 img-fluid rounded' alt={content[3].title} />
                                                </a>
                                            </div>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-6 rounded position-relative">
                            {
                                content[4] && content[4].image.url !== "" ?
                                    <div className="hover-images w-100 h-100">
                                        <a href={content[4].url} target="_blank" rel="noopener noreferrer">
                                            <img src={content[4].image.url} className='w-100 img-fluid rounded' alt={content[4].title} />
                                        </a>
                                    </div>
                                    :

                                    <></>
                            }
                        </div>
                    </div>

                    :


                    <></>

            }

        </div>
    )
}

export default TemplateTwoSectionAndLeftFourSaved