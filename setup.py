import setuptools

setuptools.setup(
	name = "zare",
	description = "A wrapper for Zare's server management API.",
	keywords = "wrapper module library server viral32111",

	version = "0.1.0",
	license = "AGPL-3.0-only",
	url = "https://github.com/viral32111/zare",

	author = "viral32111",
	author_email = "contact@viral32111.com",

	python_requires = ">=3.9.4",
	packages = [ "zare" ],
	install_requires = [ "requests" ],

	classifiers = [
		"Intended Audience :: Developers",
		"Topic :: Internet",
		"Topic :: Software Development :: Libraries :: Python Modules",
		"License :: OSI Approved :: GNU Affero General Public License v3",
		"Programming Language :: Python :: 3.9",
		"Natural Language :: English",
		"Operating System :: OS Independent",
	]
)
