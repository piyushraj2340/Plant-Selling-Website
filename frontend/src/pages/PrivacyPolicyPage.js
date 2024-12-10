import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicyPage = () => {
    return (
        <section className="bg-light py-5">
        <div className="container py-4 px-3 rounded bg-white">
          <h1 className="text-center mb-4">Privacy Policy</h1>
          <p className="text-center">Last updated: December 06, 2024</p>
          <p>
            This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your
            information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          <p>
            We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection
            and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help
            of the{' '}
            <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank" rel="noopener noreferrer">
              Privacy Policy Generator
            </a>
            .
          </p>
  
          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>
            The words of which the initial letter is capitalized have meanings defined under the following conditions. The
            following definitions shall have the same meaning regardless of whether they appear in singular or plural.
          </p>
  
          <h3>Definitions</h3>
          <p>For the purposes of this Privacy Policy:</p>
          <div className="row">
            <div className="col-12 col-md-6">
              <ul>
                <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party.</li>
                <li><strong>Company</strong> refers to PlantSeller.</li>
                <li><strong>Cookies</strong> are small files that are placed on Your device.</li>
                <li><strong>Country</strong> refers to Bihar, India.</li>
                <li><strong>Device</strong> means any device that can access the Service.</li>
              </ul>
            </div>
            <div className="col-12 col-md-6">
              <ul>
                <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
                <li><strong>Service</strong> refers to the Website.</li>
                <li><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company.</li>
                <li><strong>Third-party Social Media Service</strong> refers to any website or social network through which a User can log in or create an account.</li>
                <li><strong>Usage Data</strong> refers to data collected automatically during your use of the Service.</li>
                <li><strong>Website</strong> refers to PlantSeller, accessible from{' '}
                  <a href="https://plantseller.vercel.app/" target="_blank" rel="noopener noreferrer">
                    https://plantseller.vercel.app/
                  </a>
                </li>
                <li><strong>You</strong> means the individual accessing or using the Service.</li>
              </ul>
            </div>
          </div>
  
          <h2>Collecting and Using Your Personal Data</h2>
          <h3>Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>
            While using Our Service, We may ask You to provide Us with certain personally identifiable information that can
            be used to contact or identify You. Personally identifiable information may include, but is not limited to:
          </p>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Usage Data</li>
          </ul>
  
          <h4>Usage Data</h4>
          <p>
            Usage Data is collected automatically when using the Service and may include your Device's IP address, browser
            type, pages visited, and other diagnostic data.
          </p>
  
          <h4>Information from Third-Party Social Media Services</h4>
          <p>
            The Company allows You to create an account and log in to use the Service through third-party Social Media
            Services like Google, Facebook, Instagram, Twitter, LinkedIn. By logging in, we may collect data like your name,
            email address, and activities.
          </p>
  
          <h4>Tracking Technologies and Cookies</h4>
          <p>
            We use Cookies and similar tracking technologies to track the activity on Our Service. This helps improve the
            service and collect analytics.
          </p>
  
          <h3>Use of Your Personal Data</h3>
          <p>The Company may use Your Personal Data for the following purposes:</p>
          <ul>
            <li>To provide and maintain our Service, including monitoring usage.</li>
            <li>To manage Your Account and enable features for registered users.</li>
            <li>For the performance of a contract, including purchases or services.</li>
            <li>To contact You regarding updates or security issues.</li>
            <li>For business transfers like mergers, acquisitions, or asset sales.</li>
            <li>For other purposes like data analysis, improving services, etc.</li>
          </ul>
  
          <h3>Retention of Your Personal Data</h3>
          <p>
            The Company will retain Your Personal Data only for as long as necessary for the purposes set out in this Privacy
            Policy.
          </p>
  
          <h3>Transfer of Your Personal Data</h3>
          <p>
            Your Personal Data may be transferred to and processed in a different country where data protection laws may differ.
          </p>
  
          <h3>Delete Your Personal Data</h3>
          <p>
            You can delete or request to delete your personal data, either directly through your account settings or by
            contacting us.
          </p>
  
          <h3>Disclosure of Your Personal Data</h3>
          <h4>Business Transactions</h4>
          <p>If the Company is involved in a merger, acquisition, or asset sale, your personal data may be transferred.</p>
  
          <h4>Law enforcement</h4>
          <p>Under certain circumstances, the Company may be required to disclose your personal data by law.</p>
  
          <h3>Security of Your Personal Data</h3>
          <p>
            We strive to protect your personal data but cannot guarantee its absolute security. We use commercially acceptable
            means to protect it.
          </p>
  
          <h2>Children's Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 13. If you believe we have collected data from a child under
            13, please contact us to have it removed.
          </p>
  
          <h2>Links to Other Websites</h2>
          <p>
            Our Service may contain links to external websites. We are not responsible for the content or privacy practices of
            those sites.
          </p>
  
          <h2>Changes to this Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
            "Last updated" date.
          </p>
  
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, You can contact us:</p>
          <ul>
            <li>Email: <Link to="mailto:piyushraj2340@gmail.com">piyushraj2340@gmail.com</Link></li>
            <li>Phone: <Link to="tel:+917463980230">+917463980230</Link></li>
          </ul>
        </div>
      </section>
    )
}

export default PrivacyPolicyPage