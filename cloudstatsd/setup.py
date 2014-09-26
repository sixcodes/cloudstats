#encoding: utf-8

from setuptools import setup, find_packages


setup(
    name='cloudstatsd',
    version='0.1',
    packages=find_packages(),
    entry_points={
            'console_scripts': [
                'cloudstatsd = cloudstatsd.memload:main',
            ]
    },
    url='https://github.com/sievetech/cloudstats',
    license='3-BSD',
    author='Sieve',
    author_email='sievetech@sieve.com.br',
    description='Sieve servers dashboard!',
)
