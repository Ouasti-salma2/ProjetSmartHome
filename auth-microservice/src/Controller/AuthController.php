<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    #[Route('/api/test', name: 'api_test', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return $this->json([
            'status' => 'OK',
            'message' => 'API fonctionne correctement'
        ]);
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            // Récupérer les données
            $data = json_decode($request->getContent(), true);

            // Validation
            if (!isset($data['email']) || !isset($data['password'])) {
                return $this->json([
                    'error' => 'Email et password sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Vérifier si l'utilisateur existe déjà
            $existingUser = $entityManager->getRepository(User::class)
                ->findOneBy(['email' => $data['email']]);

            if ($existingUser) {
                return $this->json([
                    'error' => 'Cet email est deja utilise'
                ], Response::HTTP_CONFLICT);
            }

            // Créer le nouvel utilisateur
            $user = new User();
            $user->setEmail($data['email']);
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));

            if (isset($data['name'])) {
                $user->setName($data['name']);
            }

            $entityManager->persist($user);
            $entityManager->flush();

            return $this->json([
                'message' => 'Utilisateur cree avec succes',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName()
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Validation
            if (!isset($data['email']) || !isset($data['password'])) {
                return $this->json([
                    'error' => 'Email et password sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Rechercher l'utilisateur
            $user = $entityManager->getRepository(User::class)
                ->findOneBy(['email' => $data['email']]);

            if (!$user) {
                return $this->json([
                    'error' => 'Identifiants invalides'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Vérifier le mot de passe
            if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
                return $this->json([
                    'error' => 'Identifiants invalides'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Générer le token JWT
            $token = $jwtManager->create($user);

            return $this->json([
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                    'roles' => $user->getRoles()
                ]
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
