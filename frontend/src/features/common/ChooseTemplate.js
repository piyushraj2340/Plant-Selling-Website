import React from 'react'

const ChooseTemplate = ({ setIsChooseModeOpen, handelSelectedTemplate }) => {

  let SelectTemplate = (
    <div className="template-choose">
      <p>Choose Template</p>
    </div>
  )

  return (
    <section className='template-container m-0 pt-1 pt-md-2 pt-lg-3' >
      <div className="close-template-container d-flex justify-content-center align-items-center" onClick={() => setIsChooseModeOpen(false)}>
        <span className='p-3 d-inline-block'><i className="fa fa-close"></i></span>
      </div>
      <div className="mb-2 mb-md-3 container py-3">
        <div className="row mb-2 mb-md-3">
          <h2 className='h3 text-start text-md-center'>Choose Your Template</h2>
        </div>

        <div className="row mb-2 mb-md-3">
          <p className='h6'>Choose Template and Upload Images: </p>
        </div>

        {/* 1st template */}
        <div className="row mb-2 mb-md-3 template template-header rounded" onClick={() => { handelSelectedTemplate("completeSection") }}>
          <div className="template-header-complete rounded">
            <p>Complete Section</p>
          </div>
          {SelectTemplate}
        </div>

        {/* 2nd template */}
        <div className="row mb-2 mb-md-3 template template-half-width" onClick={() => { handelSelectedTemplate("twoSection") }}>
          <div className="template-half-left rounded">
            <p>First Half</p>
          </div>
          <div className="template-half-right rounded">
            <p>Second Half</p>
          </div>

          {SelectTemplate}
        </div>

        {/* 3rd template */}
        <div className="row mb-2 mb-md-3 template template-four" onClick={() => { handelSelectedTemplate("fourSection") }}>
          <div className="template-first rounded">
            <p>First</p>
          </div>
          <div className="template-second rounded">
            <p>Second</p>
          </div>
          <div className="template-third rounded">
            <p>Third</p>
          </div>
          <div className="template-fourth rounded">
            <p>Fourth</p>
          </div>

          {SelectTemplate}
        </div>

        {/* 4th template */}
        <div className="row mb-2 mb-md-3 template template-half-right-two vertical" onClick={() => { handelSelectedTemplate("twoSectionAndRightVertical") }}>
          <div className="template-half-right-two-first rounded">
            <p>First</p>
          </div>
          <div className="template-half-right-two-second rounded d-flex flex-column align-items-center py-2 w-100 h-100 rounded">
            <div className="first mb-2 bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded">
              <p>Second</p>
            </div>
            <div className="second bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded">
              <p>Third</p>
            </div>
          </div>
          {SelectTemplate}
        </div>

        {/* 5th template */}
        <div className="row mb-2 mb-md-3 template template-half-left-two vertical" onClick={() => { handelSelectedTemplate("twoSectionAndLeftVertical") }}>
          <div className="template-half-left-two-second rounded d-flex flex-column align-items-center py-2 w-100 h-100 rounded">
            <div className="first mb-2 bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded">
              <p>First</p>
            </div>
            <div className="second bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded">
              <p>Second</p>
            </div>
          </div>
          <div className="template-half-left-two-first rounded">
            <p>Third</p>
          </div>
          {SelectTemplate}
        </div>

        {/* 6th template */}
        <div className="row mb-2 mb-md-3 template template-half-left-four" onClick={() => { handelSelectedTemplate("twoSectionAndLeftFour") }}>
          <div className="template-half-left-four-second rounded d-flex flex-column py-2 w-100 h-100 rounded">
            <div className="first bg-secondary w-100 h-100 d-flex justify-content-center align-items-center rounded">
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>First</p>
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>Second</p>
            </div>
            <div className="second bg-secondary w-100 h-100 d-flex justify-content-center align-items-center rounded">
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>Third</p>
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>Fourth</p>
            </div>
          </div>
          <div className="template-half-left-four-first rounded">
            <p>Fifth</p>
          </div>
          {SelectTemplate}
        </div>

        {/* 7th template */}
        <div className="row mb-2 mb-md-3 template template-half-right-four" onClick={() => { handelSelectedTemplate("twoSectionAndRightFour") }}>
          <div className="template-half-right-four-first rounded">
            <p>First</p>
          </div>
          <div className="template-half-right-four-second rounded d-flex flex-column align-items-center py-2 w-100 h-100 rounded">
            <div className="first bg-secondary h-100 w-100 d-flex justify-content-center align-items-center rounded">
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>Second</p>
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>Third</p>
            </div>
            <div className="second bg-secondary h-100 w-100 d-flex justify-content-center align-items-center rounded">
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>Fourth</p>
              <p className='w-50 h-100 text-center border rounded d-flex justify-content-center align-items-center m-0 p-0'>Fifth</p>
            </div>
          </div>
          {SelectTemplate}
        </div>

      </div>
    </section>
  )
}

export default ChooseTemplate