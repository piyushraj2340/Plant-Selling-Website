import React from 'react'

const ContactUs = () => {
    document.title = "Contact Us"
    return (
        <section className='bg-section'>
            <div className="container p-2">
                <div className="row d-flex justify-content-center border rounded shadow bg-secondary text-white">
                    <div className="col-12 p-5">
                        <form method='post'>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input type="text" className="form-control" id="name" placeholder="Enter Name" name="customerName" />
                                <p className="text-danger m-2 small"></p>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="number" className="form-label">Phone:</label>
                                <input type="number" className="form-control" id="name" placeholder="Enter Number" name="customerPhone" />
                                <p className="text-danger m-2 small"></p>
                            </div>
                            <div className="mb-3 mt-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" name="customerEmail" />
                                <p className="text-danger m-2 small"></p>
                            </div>
                            <div className='mb-3 mt-3'>
                                <label htmlFor="comment" className="form-label">Message:</label>
                                <textarea className="form-control" rows="5" id="message" name="customerMessage" ></textarea>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name="termsAndConditions" /> terms and conditions
                                </label>
                            </div>
                            <div className='d-flex flex-row-reverse'>
                                <button className='btn btn-primary' >Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactUs;