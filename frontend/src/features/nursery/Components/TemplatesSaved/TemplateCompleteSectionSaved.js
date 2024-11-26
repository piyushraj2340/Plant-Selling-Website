import React from 'react';

const TemplateCompleteSectionSaved = ({ content }) => {

    return (

        <div className='col-12 col-md-11 px-2 px-md-0'>
            {
                content.length && content[0].image.url !== "" ?
                    <div className='p-0 template template-images rounded position-relative'>
                        <div className="hover-images w-100 h-100">
                            <a href={content[0].url} target="_blank" rel="noopener noreferrer">
                                <img src={content[0].image.url} className='w-100 img-fluid rounded' alt={content[0].title} />
                            </a>
                        </div>
                    </div>

                    :


                    <></>
            }
        </div>
    )
}

export default TemplateCompleteSectionSaved