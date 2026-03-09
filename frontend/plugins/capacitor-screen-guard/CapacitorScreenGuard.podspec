Pod::Spec.new do |s|
  s.name = 'CapacitorScreenGuard'
  s.version = '0.0.1'
  s.summary = 'Plugin to detect screenshots and screen recording'
  s.license = 'MIT'
  s.homepage = 'https://your-domain.com/'
  s.author = 'Your Name'
  s.source = { :git => 'https://your-repo-url.git', :tag => '0.0.1' }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target = '13.0'
  s.dependency 'Capacitor'
end
