import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">UniEvent Pro</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Simplifying student event management.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="https://github.com/Tanya391" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                            <span className="sr-only">GitHub</span>
                            <Github className="h-6 w-6" />
                        </a>
                        <a href="https://www.linkedin.com/in/tanya-bharti-602706292/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-6 w-6" />
                        </a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    &copy; {new Date().getFullYear()} UniEvent Pro. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
