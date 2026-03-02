import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* HERO SECTION */}
            <div
                className="relative flex flex-col items-center justify-center text-center px-6 py-32 bg-cover bg-center"
                style={{ backgroundImage: "url('/institute.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative z-10 text-white space-y-6 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        C.V.M. Higher Secondary Education Complex
                    </h1>

                    <p className="text-lg opacity-90">
                        Science Stream • Established June 1976 • Vallabh
                        Vidyanagar
                    </p>

                    <div className="flex justify-center gap-4 mt-6">
                        <Link
                            to="/login"
                            className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                        >
                            Alumni Login
                        </Link>

                        <Link
                            to="/signup"
                            className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
                        >
                            Join Alumni Network
                        </Link>
                    </div>
                </div>
            </div>

            {/* ABOUT SECTION */}
            <div className="px-6 py-16 max-w-5xl mx-auto text-center space-y-6">
                <h2 className="text-4xl font-bold">About the Institute</h2>

                <p className="text-gray-600 leading-relaxed">
                    C.V.M. Higher Secondary Education Complex, Science Stream,
                    Vallabh Vidyanagar was established in June 1976. The donor
                    of the Institute, Shri Rajratna Purushottambhai Patel, was a
                    native of Nar, Ta. Petlad.
                </p>

                <p className="text-gray-600 leading-relaxed">
                    Shri R. P. Patel rendered his long services as an Honorary
                    Principal and guided the institution to its highest summit
                    of success.
                </p>
            </div>

            {/* LEGACY SECTION */}
            <div className="bg-gray-50 px-6 py-16 text-center space-y-6">
                <h2 className="text-4xl font-bold">Legacy & Leadership</h2>

                <p className="text-gray-600 leading-relaxed max-w-4xl mx-auto">
                    Smt Umaben Desai, Shri Jitendrakumar R. Patel and Shri H. C.
                    Patel rendered unique services to the school. At present,
                    Shri Sanjay C. Suthar is serving as the Incharge Principal.
                </p>
            </div>

            {/* CONTACT SECTION */}
            <div className="px-6 py-16 max-w-4xl mx-auto text-center space-y-4">
                <h2 className="text-4xl font-bold">Contact Address</h2>

                <div className="text-gray-600 leading-relaxed space-y-1">
                    <p>CHARUTAR VIDYA MANDAL</p>
                    <p>HIGHER SECONDARY EDUCATION COMPLEX (SCIENCE STREAM)</p>
                    <p>Rajratna P. T. Patel Science College Building</p>
                    <p>Post Box No. 27, Mota Bazar, Nr. Post Office</p>
                    <p>Vallabh Vidyanagar - 388 120, Ta & Dist Anand</p>
                    <p>Ph. No. (02692) 230760</p>
                    <p>Email: principalcvmhsecss@yahoo.com</p>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-black text-white text-center py-6 text-sm">
                © {new Date().getFullYear()} C.V.M. Higher Secondary Education
                Complex. All Rights Reserved.
            </footer>
        </div>
    );
}
