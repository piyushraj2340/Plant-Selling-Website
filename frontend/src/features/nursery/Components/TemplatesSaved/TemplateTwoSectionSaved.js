import React from 'react'

const TemplateTwoSectionSaved = ({ content }) => {

    return (
        <div className='col-12 col-md-11 px-2 px-md-0'>
            {content.length > 0 ?

                <div className="p-0 row rounded" >
                    <div className="m-0 col-6 rounded position-relative">
                        {content[0] && content[0].image.url !== "" ?
                            <div className="hover-images w-100">
                                <a href={content[0].url} target="_blank" rel="noopener noreferrer">
                                    <img src={content[0].image.url} className='w-100 img-fluid rounded' alt={content[0].title} />
                                </a>
                            </div>
                            :
                            <></>
                        }

                    </div>
                    <div className="m-0 col-6 rounded position-relative">
                        {content[1] && content[1].image.url !== "" ?
                            <div className="hover-images w-100 ">
                                <a href={content[1].url} target="_blank" rel="noopener noreferrer">
                                    <img src={content[1].image.url} className='w-100 img-fluid rounded' alt={content[1].title} />
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

export default TemplateTwoSectionSaved