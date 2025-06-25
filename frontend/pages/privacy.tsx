import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ContactAndFooter from '../components/ContactAndFooter';
import Head from 'next/head';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProfileResponse {
  user: User;
}

export default function Privacy() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get<ProfileResponse>('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (axios.isAxiosError(err) && err.response?.status !== 401) {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Privacy Policy - AvlokanIAS</title>
        <meta name="description" content="Privacy Policy for AvlokanIAS - Your trusted platform for UPSC answer writing practice and expert evaluation." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PRIVACY STATEMENT</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?</h2>
          <div className="prose prose-lg">
            <p>
              When you purchase something from our website, as part of the buying and selling process, we collect the personal information you give us such as your name, address, phone number and email address.
            </p>
            <p>
              When you browse our website, we also automatically receive your computer's internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
            </p>
            <p>
              Email marketing (if applicable): With your permission, we may send you emails about your current plan updates, new products (including products of independent third parties), and other updates.
            </p>
            <p>
              SMS marketing (if applicable): With your permission, we may send you SMS about your current plan updates, new products (including products of independent third parties), and other updates.
            </p>
            <p>
              Note: Your personal data will never be shared with any third party except payment gateways (e.g. Razorpay) which is mandatory as we do not save any of your financial details.
            </p>
            <p>
              The answer scripts submitted by you become the intellectual property of AvlokanIAS.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 2 - CONSENT</h2>
          <div className="prose prose-lg">
            <h3 className="text-xl font-semibold mb-2">How do you get my consent?</h3>
            <p>
              When you provide us with personal information to complete a transaction, verify your credit card, purchase a plan, or cancel a plan, we imply that you consent to our collecting it and using it for that specific reason only.
            </p>
            <p>
              If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.
            </p>
            <h3 className="text-xl font-semibold mb-2">How do I withdraw my consent?</h3>
            <p>
              If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, use, or disclosure of your information, at anytime, by contacting us at info@avlokanias.com
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 3 - DISCLOSURE</h2>
          <div className="prose prose-lg">
            <p>
              We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
            </p>
            <p>
              AvlokanIAS can use your submitted answers without reference to any persona or identity for research, statistical analysis improving the Platform of functionalities offered thereon and business intelligence purpose and may transfer, or sell such research, statistical or intelligence data in an aggregated or non-personally identifiable form to third parties and affiliates.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 4 - PAYMENT</h2>
          <div className="prose prose-lg">
            <p>
              We use Razorpay for processing payments. We/Razorpay do not website your card data on their servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment. Your purchase transaction data is only used as long as is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is not saved.
            </p>
            <p>
              Our payment gateway adheres to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover.
            </p>
            <p>
              PCI-DSS requirements help ensure the secure handling of credit card information by our website and its service providers.
            </p>
            <p>
              For more insight, you may also want to read the terms and conditions of Razorpay on https://razorpay.com
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 5 - THIRD-PARTY SERVICES</h2>
          <div className="prose prose-lg">
            <p>
              In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.
            </p>
            <p>
              However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.
            </p>
            <p>
              For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.
            </p>
            <p>
              In particular, remember that certain providers may be located in or have facilities that are located in a different jurisdiction than either you or us. So if you elect to proceed with a transaction that involves the services of a third-party service provider, then your information may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located.
            </p>
            <p>
              Once you leave our website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website's Terms of Service.
            </p>
            <h3 className="text-xl font-semibold mb-2">Links</h3>
            <p>
              When you click on links on our website, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 6 - SECURITY</h2>
          <div className="prose prose-lg">
            <p>
              To protect your personal information, we take reasonable precautions and follow industry's best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 7 - COOKIES</h2>
          <div className="prose prose-lg">
            <p>
              We use cookies to maintain the session of your account. It is not used to personally identify you on other websites.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 8 - AGE OF CONSENT</h2>
          <div className="prose prose-lg">
            <p>
              By using this site, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SECTION 9 - CHANGES TO THIS PRIVACY POLICY</h2>
          <div className="prose prose-lg">
            <p>
              We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
            </p>
            <p>
              If our website is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">QUESTIONS AND CONTACT INFORMATION</h2>
          <div className="prose prose-lg">
            <p>
              If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer at info@avlokanias.com
            </p>
          </div>
        </section>
      </main>
      <ContactAndFooter />
    </div>
  );
} 