module.exports = {
  branches: ['master'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        // Setting this to false disables the default behavior
        // of opening a GitHub issue when a release fails.
        // We have other methods of tracking these failures.
        failComment: false,
        assets: [
          { path: 'target/lo-linux-x64.zip', label: 'lo-linux-x64.zip' },
          { path: 'target/lo-macos-x64.zip', label: 'lo-macos-x64.zip' },
          { path: 'target/lo-windows-x64.zip', label: 'lo-windows-x64.zip' }
        ]
      }
    ]
  ]
};
