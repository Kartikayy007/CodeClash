export const handlePostAuthRedirect = (router: any) => {
  const needsAuthForContest = localStorage.getItem('needsAuthForContest');
  const contestId = localStorage.getItem('contestId');
  
  if (needsAuthForContest === 'true' && contestId) {
    localStorage.removeItem('needsAuthForContest');
    localStorage.removeItem('contestId');
    
    router.push(`/contest/join/${contestId}`);
    return;
  }
  
  router.push('/dashboard');
};
