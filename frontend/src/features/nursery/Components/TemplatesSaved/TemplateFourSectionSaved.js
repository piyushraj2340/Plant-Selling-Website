import React from 'react'

const TemplateFourSectionSaved = ({ content }) => {

    return (
        <div className='col-12 col-md-11 px-2 px-md-0'> {
            content.length > 0 ?


                <div className="p-0 row template-images rounded" >
                    <div className="template-first rounded position-relative col-3">
                        {content[0] && content[0].image.url !== "" ?

                            <div className="hover-images border-black w-100 h-100">
                                <a href={content[0].url} target="_blank" rel="noopener noreferrer">
                                    <img src={content[0].image.url} className='w-100 img-fluid rounded' alt={content[0].title} />
                                </a>
                            </div>
                            :

                            <></>
                        }

                    </div>
                    <div className="template-second rounded position-relative col-3">
                        {content[1] && content[1].image.url !== "" ?

                            <div className="hover-images w-100 h-100">
                                <a href={content[1].url} target="_blank" rel="noopener noreferrer">
                                    <img src={content[1].image.url} className='w-100 img-fluid rounded' alt={content[1].title} />
                                </a>
                            </div>
                            :
                            <></>
                        }
                    </div>
                    <div className="template-third rounded position-relative col-3">
                        {content[2] && content[2].image.url !== "" ?

                            <div className="hover-images w-100 h-100">
                                <a href={content[2].url} target="_blank" rel="noopener noreferrer">
                                    <img src={content[2].image.url} className='w-100 img-fluid rounded' alt={content[2].title} />
                                </a>

                            </div>
                            :

                           <></>
                        }
                    </div>
                    <div className="template-fourth rounded position-relative col-3">
                        {content[3] && content[3].image.url !== "" ?

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

                :

                <></>
        }

        </div>

    )
}

export default TemplateFourSectionSaved