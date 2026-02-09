import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
# Replace 'news_app' with your actual app name
from news.models import Article, ArticleImage, Tag, Reaction, Comment

class Command(BaseCommand):
    help = 'Seed the database with articles, tags, reactions, and comments'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # Create Users (Using get_or_create to avoid errors on re-run)
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            email='admin@gmail.com',
            defaults={'is_staff': True, 'is_superuser': True}
        )
        admin_user.set_password('admin123')
        admin_user.save()

        test_user, _ = User.objects.get_or_create(username='tester', email='tester@gmail.com')
        test_user.set_password('tester123')
        test_user.save()

        # Define Sample Data
        titles = [
            "Breaking: Tech Giant Announces New AI",
            "The History of the Internet",
            "How Apple is Beating the Market",
            "Silicon Valley's Next Big Bet on Robotics",
            "Why Cybersecurity is the Priority for 2025",
            "Quantum Computing: From Theory to Reality",
            "The Rise of Decentralized Social Media",
            "Local Team Wins Regional Championship",
            "Olympic Qualifiers: Athletes to Watch",
            "The Evolution of Data Analytics in Football",
            "Underdog Story: From High School to Pro League",
            "Extreme Sports: The Growth of Mountain Biking",
            "10 Tips for Better Sleep Tonight",
            "New Study on the Benefits of Coffee",
            "Mental Health: The Importance of Digital Detox",
            "The Science Behind Intermittent Fasting",
            "Yoga vs. HIIT: Which is Better for Longevity?",
            "Advances in Genetic Research for Rare Diseases",
            "How to Start a Small Business",
            "The Future of Renewable Energy",
            "Global Markets: What to Expect this Quarter",
            "The Death of the 9-to-5: Remote Work Trends",
            "Why Sustainable Fashion is the New Gold Mine",
            "Inflation Explained: How it Affects Your Savings",
            "Traveling on a Budget in 2025",
            "The Art of Minimalist Living in a Big City",
            "Hidden Gems: Top 10 Underrated Travel Spots",
            "Home Gardening: A Beginner's Guide to Herbs",
            "The Psychology of Productivity and Focus",
            "Exploring the World's Best Street Food Markets"
        ]

        tag_labels = [
            "Breaking",
            "Sports",
            "Technology",
            "Health",
            "Travel",
            "Finance",
            "Art",
            "Environment",
            "Education",
            "Lifestyle"
        ]
        
        # Create Tags
        tag_objects = []
        for label in tag_labels:
            tag, _ = Tag.objects.get_or_create(
                label=label,
                defaults={'image': 'tags/default.webp'}
            )
            tag_objects.append(tag)

        # Create Articles
        for i in range(100):
            article = Article.objects.create(
                title=f"{random.choice(titles)} #{i}",
                content="This is the main body content for the article. " * random.randint(5, 15),
                lead_img='articles/default.webp',
                views=random.randint(20, 100) # Give charts some data to show
            )

            # Add extra images
            for _ in range(random.randint(1, 3)):
                ArticleImage.objects.create(
                    article=article,
                    image='articles/extra.webp'
                )

            # Add random tags (using the M2M relationship)
            selected_tags = random.sample(tag_objects, k=random.randint(1, 3))
            article.tags.add(*selected_tags) #

            # Add random Reactions
            for user in [admin_user, test_user]:
                if random.choice([True, False]): # 50% chance to react
                    Reaction.objects.create(
                        user=user,
                        article=article,
                        type=random.choice(['like', 'dislike']) #
                    )

            # Add random Comments
            if random.choice([True, False]):
                Comment.objects.create(
                    user=test_user,
                    article=article,
                    content=f"Great article! Insight #{i}"
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))