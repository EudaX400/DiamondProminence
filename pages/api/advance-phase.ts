import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { tournamentId } = req.body;

      
      const matches = await prisma.match.findMany({
        where: { tournamentId: tournamentId },
      });

      
      const currentPhase = Math.max(...matches.map(match => match.phase));

     
      const allCurrentPhaseMatchesCompleted = matches
        .filter(match => match.phase === currentPhase)
        .every(match => match.winnerId);

      if (!allCurrentPhaseMatchesCompleted) {
        return res.status(400).json({ error: 'Not all matches in the current phase are completed' });
      }

      
      const winners = matches
        .filter(match => match.phase === currentPhase)
        .map(match => match.winnerId);

      
      const newMatches = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          newMatches.push({
            tournamentId: tournamentId,
            player1Id: winners[i],
            player2Id: winners[i + 1],
            player1Score: 0, 
            player2Score: 0, 
            phase: currentPhase + 1,
          });
        }
      }

      await prisma.match.createMany({ data: newMatches });

      res.status(200).json({ message: 'Phase advanced' });
    } catch (error) {
      console.error('Error advancing phase:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
