import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer bg-dark-primary w-full flex flex-col items-center justify-center">
            <div className="container max-w-7xl px-4 py-8 mx-auto">
                <div className="footer-head flex justify-center ">
                    <img src="/brand-name-light.svg" alt="Logo" className="ml-14 h-16" />
                </div>
                
                <div className="footer-content w-full mt-8 flex  justify-between gap-8">
                    <div className='left-container flex flex-col gap-2'>
                        
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">Payment</Link>
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">Shipping & Deliveries</Link>
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">Exchange & Returns</Link>
                    </div>
                    <div className='center-container flex flex-col gap-2'>
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">FAQ&apos;S</Link>
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">How to Buy</Link>
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">Retail Stores</Link>

                     
                    </div>

                    <div className='right-container flex flex-col gap-2'>
                        <Link to="/signin" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">Signin/Signup</Link>
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">About Us</Link>
                        <Link to="/" className="text-light-primary text-sm hover:text-neutral-300 transition-colors">Contact Us</Link>
                    </div>
                </div>

                <div className="footer-bottom mt-8 border-t border-light-secondary pt-4">
                    <p className="text-center mt-2.5 text-light-primary text-xs">
                        © {new Date().getFullYear()} Minimal. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
