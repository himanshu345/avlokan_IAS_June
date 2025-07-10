module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/payment/:path*',
        destination: 'http://localhost:5000/api/payment/:path*',
      },
    ];
  },
}; 