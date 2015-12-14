export default function buildKernel(sigma) {

  // We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

  function gauss( x, sigma ) {

    return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );

  }

  var i, values, sum, halfWidth, kMaxKernelSize = 25, kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;

  if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
  halfWidth = ( kernelSize - 1 ) * 0.5

  values = new Array( kernelSize );
  sum = 0.0;
  for ( i = 0; i < kernelSize; ++i ) {

    values[ i ] = gauss( i - halfWidth, sigma );
    sum += values[ i ];

  }

  // normalize the kernel

  for ( i = 0; i < kernelSize; ++i ) values[ i ] /= sum;

  return values;
};

